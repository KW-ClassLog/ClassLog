export interface fetchStudentTodayLecturesResult {
  todayTotal: number;
  todayDone: number;
  todayLeft: number;
  todayLectures: {
    lectureId: string;
    lectureName: string;
    lectureDate: string;
    className: string;
    startTime: string;
    endTime: string;
    session: number;
  }[];
}
