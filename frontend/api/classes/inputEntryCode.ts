import axios from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { InputEntryCodeResult } from "@/types/classes/inputEntryCode";

export async function inputEntryCode({ entryCode }: { entryCode: string }) {
  try {
    const response = await axiosInstance.post<
      ApiResponse<InputEntryCodeResult | null>
    >(ENDPOINTS.CLASSES.INPUT_ENTRY_CODE, { entryCode });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<InputEntryCodeResult | null>;
    }
    throw error;
  }
}
