export interface FetchLectureDetailResult {
  lectureId: string;
  classId: string;
  lectureName: string;
  lectureDate: string;
  weekDay: string;
  session: number;
  startTime: string;
  endTime: string;
  status: "beforeLecture" | "onLecture" | "makeQuiz" | "checkDashboard";
}
