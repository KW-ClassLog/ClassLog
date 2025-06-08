"use client";

import FitContentButton from "@/components/Button/FitContentButton/FitContentButton";

interface LectureHeaderProps {
  title: string;
  date: string;
  time: string;
  onStartLecture: () => void;
}

export default function LectureHeader({
  title,
  date,
  time,
  onStartLecture,
}: LectureHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
      }}
    >
      <div>
        <h1 style={{ fontSize: 32, fontWeight: 700 }}>{title}</h1>
        <div style={{ color: "#888", fontSize: 16, marginTop: 4 }}>
          <span style={{ marginRight: 16 }}>{date}</span>
          <span>{time}</span>
        </div>
      </div>

      <FitContentButton onClick={onStartLecture}>
        강의 시작하기
      </FitContentButton>
    </div>
  );
}
