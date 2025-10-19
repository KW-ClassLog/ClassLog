// api/notifications/fcm.ts
import { getToken } from "firebase/messaging";
import { getFirebaseMessaging } from "@/config/firebase";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!;

export async function registerFcmToken() {
    const messaging = getFirebaseMessaging();
    if (!messaging) return;

    try {
        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (token) {
            console.log("✅ FCM Token 발급:", token);

            await axiosInstance.post(ENDPOINTS.NOTIFICATIONS.REGISTER_FCM_TOKEN, {
                token
            });

            console.log("✅ 서버에 토큰 등록 성공");
        } else {
            console.warn("⚠️ FCM 토큰이 없습니다 (사용자가 알림 권한 거부)");
        }
    } catch (err) {
        console.error("❌ FCM 토큰 등록 실패", err);
    }
}