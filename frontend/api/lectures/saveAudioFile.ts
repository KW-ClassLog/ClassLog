import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { SaveAudioFileResult } from "@/types/lectures/saveAudioFileTypes";

export async function saveAudioFile( lectureId: string, blob: Blob) {
  
  const file = new File([blob], `${lectureId}.mp3`, { type: "audio/mpeg" });

  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post<ApiResponse<SaveAudioFileResult | null>>(
    ENDPOINTS.LECTURES.SAVE_RECORDING(lectureId),
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
}