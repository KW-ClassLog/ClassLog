"use client";

import FitContentButton from "@/components/Button/FitContentButton/FitContentButton";
import styles from "./LectureHeader.module.scss";
import { Clock, Calendar, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

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
      status: "onLecture",
    });
    setLoading(false);
  }, [lectureId]);

  if (loading) return <div>로딩 중...</div>;
  if (!lectureData) return null;

  const handleStartLecture = () => {
    // TODO: 강의 시작 로직 구현
    console.log("강의 시작");
  };

  const handleMakeQuiz = () => {
    // TODO: 퀴즈 생성 로직 구현
    console.log("퀴즈 생성");
  };

  const handleCheckDashboard = () => {
    // TODO: 대시보드 확인 로직 구현
    console.log("대시보드 확인");
  };

  const formatDate = (date: string, weekDay: string) => {
    return `${date} (${weekDay})`;
  };

  const formatTime = (start: string, end: string) => {
    return `${start} ~ ${end}`;
  };

  const renderButton = () => {
    switch (lectureData.status) {
      case "onLecture":
        return (
          <FitContentButton onClick={handleStartLecture}>
            강의 시작하기
            <ChevronRight />
          </FitContentButton>
        );
      case "makeQuiz":
        return (
          <FitContentButton onClick={handleMakeQuiz}>
            퀴즈 생성하기
            <ChevronRight />
          </FitContentButton>
        );
      case "checkDashboard":
        return (
          <FitContentButton onClick={handleCheckDashboard}>
            대시보드 확인하기
            <ChevronRight />
          </FitContentButton>
        );
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.title}>
          {lectureData.session}. {lectureData.lectureName}
        </h1>
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
    </div>
  );
}
