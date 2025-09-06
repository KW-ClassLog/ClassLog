import { axiosInstance } from "@/api/axiosInstance";
import { ApiResponse } from "@/types/apiResponseTypes";

export type NotiSettingKey =
    | "quizUpload"
    | "quizAnswerUpload"
    | "lectureNoteUpload"
    | "lectureUpload"
    | "recordUpload";

export async function updateNotificationSetting(
    key: NotiSettingKey,
    value: boolean
) {
    // 서버가 PATCH + partial body를 받도록 구현했다고 가정
    const res = await axiosInstance.patch<ApiResponse<null>>(
        "/api/notifications/settings",
        { [key]: value }
    );
    return res.data;
}