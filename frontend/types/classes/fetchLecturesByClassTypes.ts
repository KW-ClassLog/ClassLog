export interface FetchLecturesByClassResult {
  lectureId: string;
  lectureName: string;
  lectureDate: string;
  startTime: string;
  endTime: string;
  status: "beforeLecture" | "onLecture" | "afterLecture";
  session: number;
}
