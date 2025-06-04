import { axiosInstance } from "@/api/axiosInstance";
import axios from "axios";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import useClassListStore from "@/store/useClassListStore";

export async function deleteClass(classId: string) {
  try {
    const response = await axiosInstance.delete<ApiResponse<void>>(
      ENDPOINTS.CLASSES.DELETE(classId)
    );

    // 클래스 삭제 성공 시 클래스 목록 갱신
    if (response.data.isSuccess) {
      const store = useClassListStore.getState();
      await store.refreshClassList();
    }

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<string | null>;
    }
    throw error;
  }
}
