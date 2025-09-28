"use client";
import React, { useEffect, useState } from "react";
import { useLectureStatusStore } from "@/store/useLectureStatusStore";
import dayjs from "dayjs";

interface QuizSectionProps {
  lectureId: string;
}

export type QuizStatus = "notYet" | "solve" | "waitingResult" | "viewResult";

export default function QuizSection({ lectureId }: QuizSectionProps) {
  const { lectureStatus, lectureDate } = useLectureStatusStore();
  const [quizStatus, setQuizStatus] = useState<QuizStatus>("notYet");

  useEffect(() => {
    // lectureDate 당일의 밤 12시가 지나면 true, 아니면 false 반환
    const canViewResult = () => {
      if (!lectureDate) return false;
      const midnight = dayjs(lectureDate + " 00:00").add(1, "day"); // 강의일의 다음날 0시(=강의일 밤 12시)
      const now = dayjs(
        new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }))
      );
      return now.isAfter(midnight);
    };
    switch (lectureStatus) {
      case "beforeLecture":
      case "onLecture":
      case "afterLectureBeforeQuiz":
        setQuizStatus("notYet");
        break;
      case "quizReadyForSubmission":
        setQuizStatus("solve");
        break;
      case "viewMyQuizResult":
        if (canViewResult()) {
          setQuizStatus("viewResult");
          console.log("viewResult");
        } else {
          setQuizStatus("waitingResult");
          console.log("waitingResult");
        }
        break;
    }
  }, [lectureStatus, lectureDate]);

  return (
    <div>
      <h3>복습 퀴즈</h3>
      <p>현재 강의 상태: {lectureStatus}</p>
      <p>강의 ID: {lectureId}</p>
      {/* 여기에 복습 퀴즈 관련 로직 추가 */}
    </div>
  );
}
