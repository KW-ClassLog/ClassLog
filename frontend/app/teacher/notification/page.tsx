"use client";

import React from 'react';
import styles from './page.module.scss';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react'; 

interface Notification {
  id: number;
  title: string;
  date: string;
  time: string;
  isNew?: boolean;
}

const notifications: Notification[] = [
  {
    id: 1,
    title: "[자료구조] 1차시 강의를 시작합니다",
    date: "2025.03.25",
    time: "16:20:00",
    isNew: true,
  },
  {
    id: 2,
    title: "[자료구조] 새 강의자료가 올라왔습니다",
    date: "2025.03.25",
    time: "16:20:00",
  },
  {
    id: 3,
    title: "[자료구조] 새 강의자료가 올라왔습니다",
    date: "2025.03.25",
    time: "16:20:00",
  },
  {
    id: 4,
    title: "[자료구조] 새 강의자료가 올라왔습니다",
    date: "2025.03.25",
    time: "16:20:00",
  },
  {
    id: 5,
    title: "[자료구조] 1차시 강의를 시작합니다",
    date: "2025.03.25",
    time: "16:20:00",
    isNew: true,
  },
];

export default function TeacherNotificationPage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => router.back()}>
          <ChevronLeft size={24} />
        </button>
        알림</header>
      <ul className={styles.notificationList}>
        {notifications.map((notification) => (
          <li key={notification.id} className={styles.notificationItem}>
            <div className={styles.title}>
              <span>{notification.title}</span>

              <span className={styles.dateTime}>
                {notification.date} {notification.time}
              </span>
            </div>
            {notification.isNew && <div className={styles.newIndicator} />}
          </li>
        ))}
      </ul>
    </div>
  );
}