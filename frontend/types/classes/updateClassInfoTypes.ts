export interface UpdateClassInfoRequest {
  classId: string;
  data: {
    className?: string;
    startDate?: string;
    endDate?: string;
    classDate?: string;
  };
}

export interface UpdateClassInfoResult {
  classId: string;
  className: string;
  startDate: string;
  endDate: string;
  classDate: string;
}
