import React from "react";
import { useLectureStatusStore } from "@/store/useLectureStatusStore";

interface QuizSectionProps {
  lectureId: string;
}

export default function QuizSection({ lectureId }: QuizSectionProps) {
  const { lectureStatus } = useLectureStatusStore();

  return (
    <div>
      <h3>복습 퀴즈</h3>
      <p>현재 강의 상태: {lectureStatus}</p>
      <p>강의 ID: {lectureId}</p>
      {/* 여기에 복습 퀴즈 관련 로직 추가 */}
    </div>
  );
}
