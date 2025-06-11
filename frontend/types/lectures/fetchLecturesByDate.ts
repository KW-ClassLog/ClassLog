export interface FetchLecturesByDateResult {
  lectureId: string;
  lectureName: string;
  lectureDate: string;
  className: string;
  startTime: string;
  endTime: string;
  status: "beforeLecture" | "onLecture" | "afterLecture";
  session: number;
}
