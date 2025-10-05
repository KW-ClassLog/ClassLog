import { axiosInstance } from "@/api/axiosInstance";
import axios from "axios";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";

// 알림 설정 응답 타입
export interface NotificationSettingResponse {
    quizUpload: boolean;
    quizAnswerUpload: boolean;
    lectureNoteUpload: boolean;
    lectureUpload: boolean;
    recordUpload: boolean;
}

export async function fetchNotificationSetting() {
    try {
        const response = await axiosInstance.get<
            ApiResponse<NotificationSettingResponse | null>
        >(ENDPOINTS.NOTIFICATIONS.GET_SETTINGS);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data as ApiResponse<NotificationSettingResponse | null>;
        }
        throw error;
    }
}
