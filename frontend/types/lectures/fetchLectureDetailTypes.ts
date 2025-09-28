export interface FetchLectureDetailResult {
  lectureId: string;
  classId: string;
  lectureName: string;
  lectureDate: string;
  weekDay: string;
  session: number;
  startTime: string;
  endTime: string;
  status: LectureStatus;
}

export type LectureStatus =
  | "beforeLecture"
  | "onLecture"
  | "makeQuiz"
  | "checkDashboard";
