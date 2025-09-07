import React from "react";
import { useLectureStatusStore } from "@/store/useLectureStatusStore";

export default function QuizSection() {
  const { lectureStatus } = useLectureStatusStore();

  return (
    <div>
      <h3>복습 퀴즈</h3>
      <p>현재 강의 상태: {lectureStatus}</p>
      {/* 여기에 복습 퀴즈 관련 로직 추가 */}
    </div>
  );
}
