import axios from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import {
  MappingLectureNoteRequest,
  MappingLectureNoteResult,
} from "@/types/lectures/mappingLectureNoteTypes";

export async function mappingLectureNote(
  lectureId: string,
  lectureNoteIds: string[]
) {
  try {
    const requestBody: MappingLectureNoteRequest = { lectureNoteIds };

    const response = await axiosInstance.post<
      ApiResponse<MappingLectureNoteResult[]>
    >(ENDPOINTS.LECTURES.SELECT_NOTE(lectureId), requestBody);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<MappingLectureNoteResult[]>;
    }
    throw error;
  }
}
