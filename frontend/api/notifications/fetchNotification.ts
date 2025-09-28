import { axiosInstance } from "@/api/axiosInstance";
import axios from "axios";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";

export interface NotificationResponse {
    notificationId: string;
    className: string | null;
    alarmType: string;
    isRead: boolean;
    createdAt: string;
}

const alarmTypeLabels: Record<string, string> = {
    quizUpload: "새 퀴즈가 업로드되었습니다",
    quizAnswerUpload: "퀴즈 답안이 업로드되었습니다",
    lectureNoteUpload: "새 강의자료가 올라왔습니다",
    startLecture: "강의가 시작되었습니다",
    recordUpload: "녹음 파일이 업로드되었습니다",
};

export function getAlarmMessage(alarmType: string) {
    return alarmTypeLabels[alarmType] ?? alarmType;
}

// 알림 목록 조회 API
export async function fetchNotifications() {
    try {
        const response = await axiosInstance.get<
            ApiResponse<Omit<NotificationResponse, "alarmMessage">[]>
        >(ENDPOINTS.NOTIFICATIONS.LIST);

        if (response.data.isSuccess && response.data.result) {
            // alarmType → alarmMessage 변환 추가
            const mapped = response.data.result.map((n) => ({
                ...n,
                alarmMessage: alarmTypeLabels[n.alarmType] ?? n.alarmType,
            }));
            return { ...response.data, result: mapped };
        }

        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data as ApiResponse<NotificationResponse[]>;
        }
        throw error;
    }
}