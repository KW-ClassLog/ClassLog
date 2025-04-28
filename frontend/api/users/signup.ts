import axios from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { SignupRequest, SignupResult } from "@/types/users/signupTypes";

export async function signup({
  role,
  name,
  phoneNumber,
  organization,
  email,
  password,
}: SignupRequest) {
  try {
    const response = await axiosInstance.post<ApiResponse<string | null>>(
      ENDPOINTS.USERS.SIGNUP,
      { role, name, phoneNumber, organization, email, password }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<SignupResult>;
    }
    throw error;
  }
}
