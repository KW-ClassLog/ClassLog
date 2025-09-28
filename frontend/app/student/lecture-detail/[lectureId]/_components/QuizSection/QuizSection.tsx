import React, { useEffect, useState } from "react";
import { useLectureStatusStore } from "@/store/useLectureStatusStore";
import dayjs from "dayjs";

interface QuizSectionProps {
  lectureId: string;
}

export type QuizStatus = "notYet" | "solve" | "waitingResult" | "viewResult";

export default function QuizSection({ lectureId }: QuizSectionProps) {
  const { lectureStatus } = useLectureStatusStore();
  const [quizStatus, setQuizStatus] = useState<QuizStatus>("notYet");

  useEffect(() => {
    const canViewResult = () => {
      const now = dayjs(
        new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }))
      );
      const midnight = now.startOf("day").add(1, "day");
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
        } else {
          setQuizStatus("waitingResult");
        }
        break;
    }
  }, [lectureStatus]);

  return (
    <div>
      <h3>복습 퀴즈</h3>
      <p>현재 강의 상태: {lectureStatus}</p>
      <p>강의 ID: {lectureId}</p>
      {/* 여기에 복습 퀴즈 관련 로직 추가 */}
    </div>
  );
}
