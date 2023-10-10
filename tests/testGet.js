import LessonController from "../controllers/lessonController.js";
import db from "../db.js";

jest.mock("../db.js");

describe("LessonController.getAllLessons", () => {
  afterAll(async () => {
    await db.end();
  });
  test("should return lessons when valid parameters are provided", async () => {
    const req = {
      query: {
        date: "2023-09-01,2023-09-05",
        status: "1",
        teacherIds: "1,2",
        studentsCount: "1,2",
        page: "1",
        lessonsPerPage: "5",
      },
    };
    const expectedResponse = [
      { id: 1, title: "Lesson 1" },
      { id: 2, title: "Lesson 2" },
    ];
    db.query.mockResolvedValueOnce({ rows: expectedResponse });

    const res = {
      send: jest.fn(),
    };

    await LessonController.getAllLessons(req, res);

    expect(res.send).toHaveBeenCalledWith(expectedResponse);
  });

  test("should handle invalid parameters and send an error response", async () => {
    const req = {
      query: {
        date: "invalid-date",
      },
    };

    const res = {
      send: jest.fn(),
    };

    await LessonController.getAllLessons(req, res);

    expect(res.send).toHaveBeenCalledWith({
      message: "Invalid input parameters.",
    });
  });

  test("should handle missing status and send an error response", async () => {
    const req = {
      query: {
        date: "2023-09-01,2023-09-05",
        teacherIds: "1,2",
        studentsCount: "1,2",
        page: "1",
        lessonsPerPage: "5",
      },
    };

    const expectedResponse = [
      { id: 1, title: "Lesson 1" },
      { id: 2, title: "Lesson 2" },
    ];
    db.query.mockResolvedValueOnce({ rows: expectedResponse });

    const res = {
      send: jest.fn(),
    };

    await LessonController.getAllLessons(req, res);

    expect(res.send).toHaveBeenCalledWith(expectedResponse);
  });
  afterAll(async () => {
    await db.end();
  });
});
