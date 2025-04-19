"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SideBar.module.scss";
import { ROUTES } from "@/constants/routes"; // 페이지 경로 상수 가져오기
import { House, School, BookOpenText, FileText, Users } from "lucide-react";

const SideBar = () => {
  const [activeTab, setActiveTab] = useState<string>("home");
  const router = useRouter();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === "home") {
      router.push(ROUTES.teacherHome);
    } else if (tab === "class-management") {
      router.push(ROUTES.teacherLectureManagement);
    } else if (tab === "lecture-management") {
      router.push(ROUTES.teacherLectureNoteManagement);
    } else if (tab === "lecturenote-management") {
      router.push(ROUTES.teacherStudentManagement);
    } else if (tab === "student-management") {
      router.push(ROUTES.teacherStudentManagement);
    }
  };

  return (
    <section className={styles.sidebar}>
      <div
        className={`${styles.tab} ${activeTab === "home" ? styles.active : ""}`}
        onClick={() => handleTabClick("home")}
      >
        <div className={styles.tabItem}>
          <House className={styles.icon} />
          <span>홈</span>
        </div>
      </div>
      <div
        className={`${styles.tab} ${
          activeTab === "class-management" ? styles.active : ""
        }`}
        onClick={() => handleTabClick("class-management")}
      >
        <div className={styles.tabItem}>
          <School className={styles.icon} />
          <span>클래스 관리</span>
        </div>
      </div>
      <div
        className={`${styles.tab} ${
          activeTab === "lecture-management" ? styles.active : ""
        }`}
        onClick={() => handleTabClick("lecture-management")}
      >
        <div className={styles.tabItem}>
          <BookOpenText className={styles.icon} />
          <span>강의 관리</span>
        </div>
      </div>
      <div
        className={`${styles.tab} ${
          activeTab === "lecturenote-management" ? styles.active : ""
        }`}
        onClick={() => handleTabClick("lecturenote-management")}
      >
        <div className={styles.tabItem}>
          <FileText className={styles.icon} />
          <span>강의자료 관리</span>
        </div>
      </div>
      <div
        className={`${styles.tab} ${
          activeTab === "student-management" ? styles.active : ""
        }`}
        onClick={() => handleTabClick("student-management")}
      >
        <div className={styles.tabItem}>
          <Users className={styles.icon} />
          <span>학생 관리</span>
        </div>
      </div>
    </section>
  );
};

export default SideBar;
