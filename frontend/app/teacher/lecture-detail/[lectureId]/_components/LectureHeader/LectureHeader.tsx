"use client";

import FitContentButton from "@/components/Button/FitContentButton/FitContentButton";
import styles from "./LectureHeader.module.scss";
import { Clock, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useLectureStatusAction } from "@/hooks/useLectureStatusAction";
import MakeQuizModal from "@/components/Modal/MakeQuizModal/MakeQuizModal";
import { FetchLectureDetailResult } from "@/types/lectures/fetchLectureDetailTypes";
import { fetchLectureDetail } from "@/api/lectures/fetchLectureDetail";
import { useLectureDetail } from "../LectureDetailContext";

export default function LectureHeader() {
  const { lectureId, setClassId } = useLectureDetail();
  const [lectureData, setLectureData] =
    useState<FetchLectureDetailResult | null>(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetchLectureDetail(lectureId);

      if (response.isSuccess && response.result) {
        setLectureData(response.result);
        setClassId(response.result.classId);
      } else {
        console.error(
          "강의 데이터를 불러오는데 실패했습니다:",
          response.message
        );
      }
    } catch (error) {
      console.error("강의 데이터를 불러오는 중 오류가 발생했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lectureId, setClassId]);

  const handleStartLecture = () => {
    // TODO: 강의 시작 로직 구현
    console.log("강의 시작");
  };

  const handleQuizModalClose = () => {
    setShowQuizModal(false);
    // 퀴즈 모달이 닫힐 때 강의 데이터를 다시 불러옴
    fetchData();
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
        <MakeQuizModal lectureId={lectureId} onClose={handleQuizModalClose} />
      )}
    </div>
  );
}
