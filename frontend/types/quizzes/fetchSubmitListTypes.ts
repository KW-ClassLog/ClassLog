export interface fetchQuizSubmitListResult {
  submitNum: number;
  studentList: {
    name: string;
    submitDate: string;
  }[];
}
