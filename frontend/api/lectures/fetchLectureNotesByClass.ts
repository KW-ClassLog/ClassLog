import { axiosInstance } from "@/api/axiosInstance";
import axios from "axios"; // 추가
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { FetchLectureNotesByClassResult } from "@/types/lectures/fetchLectureNotesByClassTypes";

export async function fetchLectureNotesByClass(classId: string) {
  try {
    const response = await axiosInstance.get<
      ApiResponse<FetchLectureNotesByClassResult[]>
    >(ENDPOINTS.LECTURES.GET_NOTE_LIST_BY_CLASS(classId));
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<
        FetchLectureNotesByClassResult[]
      >;
    }
    throw error;
  }
}
