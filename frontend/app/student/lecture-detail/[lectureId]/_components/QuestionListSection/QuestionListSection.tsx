import React from "react";
import { useLectureStatusStore } from "@/store/useLectureStatusStore";

export default function QuestionListSection() {
  const { lectureStatus } = useLectureStatusStore();

  return (
    <div>
      <h3>질문하기</h3>
      <p>현재 강의 상태: {lectureStatus}</p>
      {/* 여기에 질문하기 관련 로직 추가 */}
    </div>
  );
}
