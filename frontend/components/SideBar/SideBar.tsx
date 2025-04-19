"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./SideBar.module.scss";
import { ROUTES } from "@/constants/routes"; // 페이지 경로 상수 가져오기
import { House, School, BookOpenText, FileText, Users } from "lucide-react";
import Link from "next/link";

const SideBar = () => {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [logoSrc, setLogoSrc] = useState<string>("/images/logo1.png");

  const router = useRouter();

  // 화면 크기 변화에 따라 로고 이미지 URL 변경
  useEffect(() => {
    const handleResize = () => {
      // 특정 크기 이하로 줄어들면 로고 이미지를 변경
      if (window.innerWidth < 1280) {
        setLogoSrc("/images/logo2.png"); // 작은 화면에서는 다른 이미지
      } else {
        setLogoSrc("/images/logo1.png"); // 큰 화면에서는 기본 이미지
      }
    };

    // 화면 크기 변화 감지
    window.addEventListener("resize", handleResize);
    handleResize(); // 초기 상태 설정

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === "home") {
      router.push(ROUTES.teacherHome);
    } else if (tab === "class-management") {
      router.push(ROUTES.teacherClassManagement);
    } else if (tab === "lecture-management") {
      router.push(ROUTES.teacherLectureManagement);
    } else if (tab === "lecturenote-management") {
      router.push(ROUTES.teacherLectureNoteManagement);
    } else if (tab === "student-management") {
      router.push(ROUTES.teacherStudentManagement);
    }
  };

  return (
    <section className={styles.sidebar}>
      <Link href={ROUTES.teacherHome} className={styles.logo}>
        <Image src={logoSrc} alt="Sidebar Logo" width={120} height={120} />
      </Link>

      <div
        className={`${styles.tab} ${activeTab === "home" ? styles.active : ""}`}
        onClick={() => handleTabClick("home")}
      >
        <div className={styles.tabItem}>
          <House className={styles.icon} />
          <span className={styles.text}>홈</span>
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
          <span className={styles.text}>클래스 관리</span>
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
          <span className={styles.text}>강의 관리</span>
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
          <span className={styles.text}>강의자료 관리</span>
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
          <span className={styles.text}>학생 관리</span>
        </div>
      </div>
    </section>
  );
};

export default SideBar;
