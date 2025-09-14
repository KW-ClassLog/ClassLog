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
    const res = await axiosInstance.patch<ApiResponse<null>>(
        "/api/notifications/setting",
        { [key]: value }
    );
    return res.data;
}