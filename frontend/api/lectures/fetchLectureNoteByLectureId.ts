import { axiosInstance } from "@/api/axiosInstance";
import axios from "axios"; // 추가
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { FetchLectureNoteByLectureIdResult } from "@/types/lectures/fetchLectureNoteByLectureIdTypes";

export async function fetchLectureNoteByLectureId(lectureId: string) {
  try {
    const response = await axiosInstance.get<
      ApiResponse<FetchLectureNoteByLectureIdResult[] | null>
    >(ENDPOINTS.LECTURES.GET_NOTE_LIST(lectureId));
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<
        FetchLectureNoteByLectureIdResult[] | null
      >;
    }
    throw error;
  }
}
