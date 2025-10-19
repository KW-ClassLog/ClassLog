"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { fetchNotifications , NotificationResponse, getAlarmMessage } from "@/api/notifications/fetchNotification";

export default function StudentNotificationPage() {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      const res = await fetchNotifications();
      if (res.isSuccess && res.result) {
        setNotifications(res.result);
      } else {
        console.error("알림 조회 실패:", res.message);
      }
    };
    loadNotifications();
  }, []);

  return (
      <div className={styles.container}>

        <ul className={styles.notificationList}>
          {notifications.map((notification) => {
            const date = new Date(notification.createdAt);
            const formattedDate = date.toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });
            const formattedTime = date.toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });

            return (
                <li key={notification.notificationId} className={styles.notificationItem}>
                  <div className={styles.title}>
                <span>
                  [{notification.className ?? "알 수 없음"}] {getAlarmMessage(notification.alarmType)}
                </span>
                    <span className={styles.dateTime}>
                  {formattedDate} {formattedTime}
                </span>
                  </div>
                </li>
            );
          })}
        </ul>
      </div>
  );
}