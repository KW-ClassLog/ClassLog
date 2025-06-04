import axios from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import {
  CreateClassRequest,
  CreateClassResult,
} from "@/types/classes/createClassTypes";
import useClassListStore from "@/store/useClassListStore";

export async function createClass({
  className,
  classDate,
  startDate,
  endDate,
}: CreateClassRequest) {
  console.log("createClass", { className, classDate, startDate, endDate });
  try {
    const response = await axiosInstance.post<
      ApiResponse<CreateClassResult | null>
    >(ENDPOINTS.CLASSES.CREATE, { className, classDate, startDate, endDate });

    // 클래스 생성 성공 시 클래스 목록 갱신
    if (response.data.isSuccess) {
      const store = useClassListStore.getState();
      await store.refreshClassList();
    }

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<CreateClassResult>;
    }
    throw error;
  }
}
