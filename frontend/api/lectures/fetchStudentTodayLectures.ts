import axios from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { fetchStudentTodayLecturesResult } from "@/types/lectures/fetchStudentTodayLecturesTypes";

export async function fetchStudentTodayLectures(date: string) {
  try {
    const response = await axiosInstance.get<
      ApiResponse<fetchStudentTodayLecturesResult>
    >(ENDPOINTS.LECTURES.GET_STUDENT_LECTURES_BY_DATE(date));
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response
        .data as ApiResponse<fetchStudentTodayLecturesResult>;
    }
    throw error;
  }
}
