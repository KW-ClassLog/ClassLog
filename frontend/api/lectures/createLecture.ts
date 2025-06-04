import axios from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { CreateLectureRequest } from "@/types/lectures/createLectureTypes";

export async function createClass({
  lectureName,
  lectureDate,
  classId,
  startTime,
  endTime,
}: CreateLectureRequest) {
  console.log("createClass", {
    lectureName,
    lectureDate,
    classId,
    startTime,
    endTime,
  });
  try {
    const response = await axiosInstance.post<ApiResponse<null>>(
      ENDPOINTS.LECTURES.CREATE,
      { lectureName, lectureDate, classId, startTime, endTime }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<null>;
    }
    throw error;
  }
}
