import { axiosInstance } from "@/api/axiosInstance";
import axios from "axios";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { FetchStudentLectureDetailResult } from "@/types/lectures/fetchStudentLectureDetailTypes";

export async function fetchStudentLectureDetail(lectureId: string) {
  try {
    const response = await axiosInstance.get<
      ApiResponse<FetchStudentLectureDetailResult>
    >(ENDPOINTS.LECTURES.GET_STUDENT_LECTURE_DETAIL(lectureId));
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response
        .data as ApiResponse<FetchStudentLectureDetailResult>;
    }
    throw error;
  }
}
