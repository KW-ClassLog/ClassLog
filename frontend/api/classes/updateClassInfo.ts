import axios from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";

import useClassListStore from "@/store/useClassListStore";
import {
  UpdateClassInfoRequest,
  UpdateClassInfoResult,
} from "@/types/classes/updateClassInfoTypes";

export async function updateClassInfo({
  classId,
  data,
}: UpdateClassInfoRequest) {
  try {
    const response = await axiosInstance.patch<
      ApiResponse<UpdateClassInfoResult>
    >(ENDPOINTS.CLASSES.UPDATE(classId), { data });

    // 클래스 생성 성공 시 클래스 목록 갱신
    if (response.data.isSuccess) {
      const store = useClassListStore.getState();
      await store.refreshClassList();
    }

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<UpdateClassInfoResult>;
    }
    throw error;
  }
}
