import db from "../db.js";
import { generateDates } from "../services/dateService.js";
import ValidationService from "../services/validationService.js";

class LessonController {
  async getAllLessons(req, res) {
    try {
      const {
        date,
        status,
        teacherIds,
        studentsCount,
        page = 1,
        lessonsPerPage = 5,
      } = req.query;
      if (
        (date && !ValidationService.isValidDate(date)) ||
        (status && !ValidationService.isValidStatus(status)) ||
        (teacherIds && !ValidationService.isValidTeacher(teacherIds)) ||
        (studentsCount && !ValidationService.isValidStudent(studentsCount))
      ) {
        throw new Error("Invalid input parameters.");
      }
      const offset = (page - 1) * lessonsPerPage;
      let query = `SELECT lessons.*, 
            (SELECT COUNT(*) FROM lesson_students WHERE lesson_id = lessons.id AND visit = 't') AS visits,
            jsonb_agg(DISTINCT jsonb_build_object('id', students.id, 'name', students.name, 'visit', lesson_students.visit)) AS students,
            jsonb_agg(DISTINCT jsonb_build_object('id', teachers.id, 'name', teachers.name)) AS teachers
            FROM lessons
            LEFT JOIN lesson_students ON lessons.id = lesson_students.lesson_id
            LEFT JOIN students ON lesson_students.student_id = students.id
            LEFT JOIN lesson_teachers ON lessons.id = lesson_teachers.lesson_id
            LEFT JOIN teachers ON lesson_teachers.teacher_id = teachers.id 
        `;
      const conditions = [];
      if (date) {
        const dates = date.split(",");
        if (dates.length === 1) {
          conditions.push(` date = '${dates[0]}'::date`);
        } else if (dates.length === 2) {
          conditions.push(
            ` date BETWEEN '${dates[0]}'::date AND '${dates[1]}'::date`,
          );
        }
      }
      if (status) {
        conditions.push(` status = ${status}`);
      }
      if (teacherIds) {
        const teacherArr = teacherIds.split(",").map((id) => parseInt(id, 10));
        conditions.push(` teachers.id IN (${teacherArr.join(",")})`);
      }
      if (studentsCount) {
        const countRange = studentsCount.split(",");
        if (countRange.length === 1) {
          conditions.push(
            ` (SELECT COUNT(*) FROM lesson_students WHERE lesson_id = lessons.id) = ${countRange[0]}`,
          );
        } else if (countRange.length === 2) {
          conditions.push(
            ` (SELECT COUNT(*) FROM lesson_students WHERE lesson_id = lessons.id) BETWEEN ${countRange[0]} AND ${countRange[1]}`,
          );
        }
      }
      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
      }
      query += ` GROUP BY lessons.id ORDER BY lessons.id LIMIT ${lessonsPerPage} OFFSET ${offset}`;
      const allLessons = await db.query(query);
      res.send(allLessons.rows);
    } catch (error) {
      res.send({ message: error.message });
    }
  }

  async createLessons(req, res) {
    const client = await db.connect();
    try {
      const { teacherIds, days, firstDate, lessonsCount, lastDate } = req.body;
      if (
        (firstDate && !ValidationService.isValidDate(firstDate)) ||
        (lastDate && !ValidationService.isValidDate(lastDate)) ||
        (teacherIds && !ValidationService.isValidTeacher(teacherIds)) ||
        (days && !ValidationService.isValidDays(days)) ||
        (lessonsCount && lastDate)
      ) {
        throw new Error("Invalid input parameters.");
      }

      const lessonDates = lessonsCount
        ? generateDates(days, firstDate, lessonsCount)
        : generateDates(days, firstDate, null, lastDate);

      await client.query("BEGIN");
      let results = [];
      for (const date of lessonDates) {
        const lessonResult = await client.query(
          "INSERT INTO lessons (date, title) VALUES ($1, $2) RETURNING id",
          [date, "Blue Ocean"],
        );
        results.push(lessonResult.rows[0].id);
        const lessonId = lessonResult.rows[0].id;

        for (const id of teacherIds) {
          await client.query(
            "INSERT INTO lesson_teachers (lesson_id, teacher_id) VALUES ($1, $2)",
            [lessonId, id],
          );
        }
      }

      await client.query("COMMIT");
      res.send(results);
    } catch (error) {
      await client.query("ROLLBACK");
      res.send({ message: error.message });
    } finally {
      client.release();
    }
  }
}

export default new LessonController();
