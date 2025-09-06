"use client";
import React, { useEffect, useState } from "react";
import styles from "./LectureInfoSection.module.scss";
import { BookOpenText, Calendar, Clock } from "lucide-react";
import { fetchLectureDetail } from "@/api/lectures/fetchLectureDetail";
import { FetchLectureDetailResult } from "@/types/lectures/fetchLectureDetailTypes";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import NoDataView from "@/components/NoDataView/NoDataView";
import { useLectureTitleStore } from "@/store/useLectureTitleStore";

interface LectureInfoSectionProps {
  lectureId: string;
}

export default function LectureInfoSection({
  lectureId,
}: LectureInfoSectionProps) {
  const [lectureData, setLectureData] =
    useState<FetchLectureDetailResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setLectureTitle } = useLectureTitleStore();

  useEffect(() => {
    const loadLectureData = async () => {
      try {
        setLoading(true);
        const response = await fetchLectureDetail(lectureId);
        if (response.isSuccess && response.result) {
          setLectureData(response.result);
          setLectureTitle(response.result.lectureName);
        } else {
          setError("강의 정보를 불러올 수 없습니다.");
        }
      } catch {
        setError("강의 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadLectureData();
  }, [lectureId]);
  const getStatusText = (status: string) => {
    switch (status) {
      case "beforeLecture":
        return "강의 전";
      case "onLecture":
        return "강의 중";
      case "makeQuiz":
      case "checkDashboard":
        return "강의 종료";
      default:
        return "강의 중";
    }
  };

  const formatDate = (dateString: string, weekDay: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day} (${weekDay})`;
  };

  const formatTime = (startTime: string, endTime: string) => {
    const formatTimeString = (time: string) => {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    };

    return `${formatTimeString(startTime)} - ${formatTimeString(endTime)}`;
  };

  if (loading) {
    return <LoadingSpinner text="강의 정보를 불러오는 중..." />;
  }

  if (error || !lectureData) {
    return (
      <NoDataView
        icon={BookOpenText}
        title={"강의 정보를 불러올 수 없습니다."}
        description={"강의 정보를 불러올 수 없습니다."}
      />
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.lectureTitle}>
          {String(lectureData.session).padStart(2, "0")}.{" "}
          {lectureData.lectureName}
        </h2>
        <span className={styles.status}>
          {getStatusText(lectureData.status)}
        </span>
      </div>

      <div className={styles.divider} />

      <div className={styles.infoRow}>
        <div className={styles.infoItem}>
          <Calendar className={styles.icon} />
          <span>
            {formatDate(lectureData.lectureDate, lectureData.weekDay)}
          </span>
        </div>

        <div className={styles.infoItem}>
          <Clock className={styles.icon} />
          <span>{formatTime(lectureData.startTime, lectureData.endTime)}</span>
        </div>
      </div>
    </div>
  );
}
