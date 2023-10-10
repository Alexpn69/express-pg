class ValidationService {
  static isValidDate(date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const dates = date.split(",");
    return dates.every((date) => dateRegex.test(date.trim()));
  }

  static isValidStatus(status) {
    return status == 1 || status == 0;
  }

  static isValidTeacher(teacherIds) {
    const validTeacherIds = ["1", "2", "3", "4"];
    const teachers = Array.isArray(teacherIds)
      ? teacherIds.map((i) => i.toString())
      : teacherIds.split(",");

    if (Array.isArray(teachers)) {
      return teachers.every((id) => validTeacherIds.includes(id));
    } else {
      return validTeacherIds.includes(teachers);
    }
  }

  static isValidStudent(studentsCount) {
    const validStudents = ["1", "2", "3", "4"];
    const students = studentsCount.split(",");

    if (Array.isArray(students)) {
      return students.every((id) => validStudents.includes(id));
    } else {
      return validStudents.includes(students);
    }
  }

  static isValidDays(inputDays) {
    const validDays = [0, 1, 2, 3, 4, 5, 6];
    if (Array.isArray(inputDays)) {
      return inputDays.every((id) => validDays.includes(id));
    } else {
      return validDays.includes(inputDays);
    }
  }
}

export default ValidationService;
