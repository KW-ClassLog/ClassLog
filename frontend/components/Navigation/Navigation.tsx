"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Navigation.module.scss";
import { ROUTES } from "@/constants/routes"; // 페이지 경로 상수 가져오기
import { House, BookOpenText, Bell, User } from "lucide-react";

const Navigation = () => {
  const [activeTab, setActiveTab] = useState<string>("home");
  const router = useRouter();

  // TODO : 스토어에 활성화된 탭 저장하기

  useEffect(() => {
    // 현재 경로에 맞는 activeTab 설정
    const currentPath = window.location.pathname;

    if (currentPath.includes(ROUTES.studentClass)) {
      setActiveTab("class");
    } else if (currentPath.includes(ROUTES.studentNotification)) {
      setActiveTab("notification");
    } else if (currentPath.includes(ROUTES.studentProfile)) {
      setActiveTab("profile");
    } else if (currentPath.includes(ROUTES.studentHome)) {
      setActiveTab("home");
    }
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === "home") {
      router.push(ROUTES.studentHome);
    } else if (tab === "class") {
      router.push(ROUTES.studentClass);
    } else if (tab === "notification") {
      router.push(ROUTES.studentNotification);
    } else if (tab === "profile") {
      router.push(ROUTES.studentProfile);
    }
  };

  return (
    <section className={styles.navigation}>
      <div
        className={`${styles.tab} ${activeTab === "home" ? styles.active : ""}`}
        onClick={() => handleTabClick("home")}
      >
        <House className={styles.icon} />

        <span>홈</span>
      </div>
      <div
        className={`${styles.tab} ${
          activeTab === "class" ? styles.active : ""
        }`}
        onClick={() => handleTabClick("class")}
      >
        <BookOpenText className={styles.icon} />

        <span>클래스</span>
      </div>
      <div
        className={`${styles.tab} ${
          activeTab === "notification" ? styles.active : ""
        }`}
        onClick={() => handleTabClick("notification")}
      >
        <Bell className={styles.icon} />

        <span>알림</span>
      </div>
      <div
        className={`${styles.tab} ${
          activeTab === "profile" ? styles.active : ""
        }`}
        onClick={() => handleTabClick("profile")}
      >
        <User className={styles.icon} />

        <span>프로필</span>
      </div>
    </section>
  );
};

export default Navigation;
