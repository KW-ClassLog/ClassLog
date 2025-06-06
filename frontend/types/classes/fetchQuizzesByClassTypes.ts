export interface FetchQuizzesByClassResult {
  session: number;
  title: string;
  date: string;
  day: string;
  startTime: string;
  endTime: string;
  status: "beforeLecture" | "makeQuiz" | "checkDashboard";
  lectureId: string;
}
