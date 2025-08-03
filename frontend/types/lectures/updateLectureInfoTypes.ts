export interface UpdateLectureInfoRequest {
  lectureId: string;
  data: {
    lectureName: string;
    lectureDate: string;
    classId: string;
    startTime: string;
    endTime: string;
  };
}
