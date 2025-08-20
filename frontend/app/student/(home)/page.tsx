"use client";

import { useEffect, useState } from "react";
import { fetchStudentTodayLectures } from "@/api/lectures/fetchStudentTodayLectures";
import { getHomeProfileInfo } from "@/api/users/getHomeProfileInfo";
import { fetchStudentTodayLecturesResult } from "@/types/lectures/fetchStudentTodayLecturesTypes";
import { GetHomeProfileInfoResult } from "@/types/users/getHomeProfileInfoTypes";
import HeaderSection from "./_components/HeaderSection/HeaderSection";
import TodaySummaryCard from "./_components/TodaySummaryCard/TodaySummaryCard";
import LectureList from "./_components/LectureList/LectureList";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import styles from "./page.module.scss";

export default function StudentHomePage() {
  const [profileInfo, setProfileInfo] =
    useState<GetHomeProfileInfoResult | null>(null);
  const [todayData, setTodayData] =
    useState<fetchStudentTodayLecturesResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
        const today = new Date().toISOString().split("T")[0];

        // 병렬로 데이터 가져오기
        const [profileResponse, todayResponse] = await Promise.all([
          getHomeProfileInfo(),
          fetchStudentTodayLectures(today),
        ]);

        if (profileResponse.isSuccess && profileResponse.result) {
          setProfileInfo(profileResponse.result);
        }

        if (todayResponse.isSuccess && todayResponse.result) {
          setTodayData(todayResponse.result);
        }

        setError(null);
      } catch (err) {
        console.error("데이터를 가져오는 중 오류가 발생했습니다:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner text="로딩 중..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!profileInfo || !todayData) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className={styles.container}>
      <HeaderSection profileInfo={profileInfo} />
      <TodaySummaryCard todayData={todayData} date={today} />
      <LectureList todayData={todayData} />
    </div>
  );
}
