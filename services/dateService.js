export function generateDates(
  daysOfWeek,
  firstDate,
  lessonCount = null,
  lastDate = null,
) {
  const maxLessonCount = 300;
  const maxDuration = 365;

  const daysInWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const matchingDays = daysOfWeek.map((dayIndex) => daysInWeek[dayIndex]);
  const dates = [];
  let currentDate = new Date(firstDate);

  while (
    (!lastDate || currentDate.toISOString().split("T")[0] <= lastDate) &&
    (!lessonCount || dates.length < Math.min(lessonCount, maxLessonCount)) &&
    (currentDate - new Date(firstDate)) / (1000 * 60 * 60 * 24) <= maxDuration
  ) {
    if (matchingDays.includes(daysInWeek[currentDate.getDay()])) {
      dates.push(currentDate.toISOString().split("T")[0]);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
