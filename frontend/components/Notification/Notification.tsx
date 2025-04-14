"use client";
import React from "react";
import styles from "./Notification.module.scss";
import { useRouter } from "next/navigation"; // Next.js의 useRouter 사용
import { NOTIFICATION_TYPES } from "@/constants/notificationConstants";

type NotificationProps = {
  sessionNumber: number; // 차시
  notificationType: keyof typeof NOTIFICATION_TYPES;
  mode: "student" | "teacher";
  lectureId?: string; // notificationType이 lectureNoteUpload이 아닌 모든 경우에 필요
  classId?: string; // notificationType이 lectureNoteUpload인 경우에만 필요
  isRead: boolean; // 읽음 상태
  className: string; // 클래스명
  notificationDate: string; // 날짜
};

const Notification: React.FC<NotificationProps> = ({
  sessionNumber,
  notificationType,
  mode,
  lectureId,
  classId,
  isRead,
  className,
  notificationDate,
}) => {
  const notificationData = NOTIFICATION_TYPES[notificationType];
  const router = useRouter();
  const handleClick = () => {
    if (mode === "student") {
      const { redirectPage, activeTab } = notificationData[mode];

      if (lectureId) {
        router.push(`${redirectPage}${lectureId}?tab=${activeTab}`);
      } else if (classId) {
        router.push(`${redirectPage}${classId}tab=${activeTab}`);
      }

      if (activeTab) {
        console.log(`활성화된 탭: ${activeTab}`);
        // TODO: activeTab을 관리하는 로직을 추가
      }
    } else if (mode === "teacher") {
      if ("teacher" in notificationData) {
        const { redirectPage } = notificationData.teacher;
        if (lectureId) {
          router.push(`${redirectPage}${lectureId}`);
        }
      }
    }
  };

  return (
    <div
      className={`${styles.notification} ${
        isRead ? styles.read : styles.unread
      }`}
      onClick={handleClick} // 클릭 시 handleClick 실행
    >
      <div className={styles.leftSide}>
        <span className={styles.className}>{className}</span>
        <span className={styles.notificationComment}>
          {notificationType == "lectureNoteUpload"
            ? notificationData.comment
            : `${sessionNumber}` + notificationData.comment}
        </span>
      </div>
      <div className={styles.rightSide}>
        <span className={styles.notificationDate}>{notificationDate}</span>
        <span className={!isRead ? `${styles.unreadDot}` : `${styles.readDot}`}>
          •
        </span>
      </div>
    </div>
  );
};

export default Notification;
