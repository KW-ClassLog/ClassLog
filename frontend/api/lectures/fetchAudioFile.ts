import { axiosInstance } from "@/api/axiosInstance";
import axios from "axios"; // 추가
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { FetchAudioFileResult } from "@/types/lectures/fetchAudioFileTypes";

export async function fetchAudioFile(lectureId: string) {
  try {
    const response = await axiosInstance.get<ApiResponse<FetchAudioFileResult>>(
      ENDPOINTS.LECTURES.GET_RECORDING(lectureId)
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<FetchAudioFileResult>;
    }
    throw error;
  }
}
