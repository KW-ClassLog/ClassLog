"use client";

import FitContentButton from "@/components/Button/FitContentButton/FitContentButton";
import styles from "./LectureHeader.module.scss";
import { Clock, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useLectureStatusAction } from "@/hooks/useLectureStatusAction";
import MakeQuizModal from "@/components/Modal/MakeQuizModal/MakeQuizModal";

interface LectureData {
  lectureId: string;
  classId: string;
  lectureName: string;
  lectureDate: string;
  weekDay: string;
  session: number;
  startTime: string;
  endTime: string;
  status: "beforeLecture" | "onLecture" | "makeQuiz" | "checkDashboard";
}

interface LectureHeaderProps {
  lectureId: string;
}

export default function LectureHeader({ lectureId }: LectureHeaderProps) {
  const [lectureData, setLectureData] = useState<LectureData | null>(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: API 호출로 변경
    setLectureData({
      lectureId: "53d51ffb-729d-432f-82c4-f414d9d84860",
      classId: "93f9564f-0fdc-4d76-8577-eee7f1585df1",
      lectureName: "운영체제 이론",
      lectureDate: "2025-04-14",
      weekDay: "월",
      session: 1,
      startTime: "11:33",
      endTime: "11:35",
      status: "beforeLecture",
    });
    setLoading(false);
  }, [lectureId]);

  const handleStartLecture = () => {
    // TODO: 강의 시작 로직 구현
    console.log("강의 시작");
  };

  const actionConfig = useLectureStatusAction({
    status: lectureData?.status || "beforeLecture",
    lectureId: lectureData?.lectureId || "",
    lectureDate: lectureData?.lectureDate,
    onStartLecture: handleStartLecture,
    setShowQuizModal,
  });

  if (loading) return <div>로딩 중...</div>;
  if (!lectureData) return null;

  const formatDate = (date: string, weekDay: string) => {
    return `${date} (${weekDay})`;
  };

  const formatTime = (start: string, end: string) => {
    return `${start} ~ ${end}`;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "beforeLecture":
        return "강의 전";
      case "onLecture":
        return "강의 중";
      case "makeQuiz":
        return "강의 종료";
      case "checkDashboard":
        return "강의 종료";
      default:
        return "";
    }
  };

  const getTagClassName = (status: string) => {
    switch (status) {
      case "beforeLecture":
        return `${styles.tag} ${styles.tagBeforeLecture}`;
      case "onLecture":
        return `${styles.tag} ${styles.tagOnLecture}`;
      case "makeQuiz":
      case "checkDashboard":
        return `${styles.tag} ${styles.tagAfterLecture}`;
      default:
        return styles.tag;
    }
  };

  const renderButton = () => {
    if (!actionConfig || lectureData?.status === "beforeLecture") return null;

    const IconComponent = actionConfig.icon;
    return (
      <FitContentButton
        disabled={actionConfig.disabled || false}
        onClick={actionConfig.onClick || (() => {})}
      >
        {actionConfig.text}
        {IconComponent && <IconComponent />}
      </FitContentButton>
    );
  };

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>
            {lectureData.session}. {lectureData.lectureName}
          </h1>
          <div className={getTagClassName(lectureData.status)}>
            {getStatusText(lectureData.status)}
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.date}>
            <Calendar />
            <span>
              {formatDate(lectureData.lectureDate, lectureData.weekDay)}
            </span>
          </div>
          <div className={styles.time}>
            <Clock />
            <span>
              {formatTime(lectureData.startTime, lectureData.endTime)}
            </span>
          </div>
        </div>
      </div>

      {renderButton()}
      {showQuizModal && (
        <MakeQuizModal
          lectureId={lectureId}
          onClose={() => setShowQuizModal(false)}
        />
      )}
    </div>
  );
}
