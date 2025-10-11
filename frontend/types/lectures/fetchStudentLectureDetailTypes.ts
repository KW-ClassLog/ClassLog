export interface FetchStudentLectureDetailResult {
  lectureId: string;
  classId: string;
  lectureName: string;
  lectureDate: string;
  weekDay: string;
  session: number;
  startTime: string;
  endTime: string;
  status: StudentLectureStatus;
}

export type StudentLectureStatus =
  | "beforeLecture"
  | "onLecture"
  | "afterLectureBeforeQuiz"
  | "quizReadyForSubmission"
  | "viewMyQuizResult";
