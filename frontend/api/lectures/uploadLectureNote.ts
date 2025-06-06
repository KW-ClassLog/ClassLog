import axios from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { UploadLectureNoteResult } from "@/types/lectures/uploadLectureNoteTypes";

export async function uploadLectureNote(classId: string, files: File[]) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("file", file);
  });

  try {
    const response = await axiosInstance.post<
      ApiResponse<UploadLectureNoteResult | UploadLectureNoteResult[]>
    >(ENDPOINTS.LECTURES.UPLOAD_NOTE(classId), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<
        UploadLectureNoteResult | UploadLectureNoteResult[]
      >;
    }
    throw error;
  }
}
