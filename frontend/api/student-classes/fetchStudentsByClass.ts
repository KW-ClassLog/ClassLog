import { axiosInstance } from "@/api/axiosInstance";
import axios from "axios";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { FetchStudentsByClassResult } from "@/types/student-classes/fetchStudentsByClassTypes";

export async function fetchStudentsByClass(classId: string) {
  try {
    const response = await axiosInstance.get<
      ApiResponse<FetchStudentsByClassResult[]>
    >(ENDPOINTS.STUDENT_CLASSES.GET_STUDENTS(classId));
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<FetchStudentsByClassResult[]>;
    }
    throw error;
  }
}
