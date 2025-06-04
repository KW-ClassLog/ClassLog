export interface CreateClassRequest {
  className: string;
  classDate: string;
  startDate: string;
  endDate: string;
}

export type CreateClassResult = {
  classId: string;
  className: string;
  startDate: string;
  endDate: string;
  classDate: string;
};
