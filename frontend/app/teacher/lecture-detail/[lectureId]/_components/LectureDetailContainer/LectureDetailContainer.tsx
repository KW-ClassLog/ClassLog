"use client";
import LectureHeader from "../LectureHeader/LectureHeader";
import LectureMainGrid from "../LectureMainGrid/LectureMainGrid";
import style from "./LectureDetailContainer.module.scss";

export default function LectureDetailContainer() {
  // TODO: 실제 데이터 fetch 및 상태 관리 필요 (아래는 예시 데이터)
  const materials = [
    { id: "1", name: "Proposal.docx", size: "2.9 MB", type: "docx", url: "#" },
    { id: "2", name: "Background.jpg", size: "3.5 MB", type: "jpg", url: "#" },
    {
      id: "3",
      name: "Apex website.fig",
      size: "23.5 MB",
      type: "fig",
      url: "#",
    },
    { id: "4", name: "Illustration.ai", size: "7.2 MB", type: "ai", url: "#" },
    { id: "5", name: "Illustration.ai", size: "7.2 MB", type: "ai", url: "#" },
  ];
  const questions = [
    {
      id: "1",
      user: { name: "손아현", avatarUrl: "/avatar.png" },
      content: "Hi, i want make enquiries about yo...",
      time: "12:55 am",
    },
  ];
  const audio = { name: "ADT.mp3", size: "2.9 MB", url: "#" };
  const quizSummary = {
    totalParticipants: 208,
    quizCount: 4,
    averageScore: 85,
    onViewDetails: () => {},
  };

  return (
    <div className={style.lectureDetailContainer}>
      <LectureHeader
        title="01. ADT"
        date="2025.03.18 (화)"
        time="10:30 - 11:45 AM"
        onStartLecture={() => {}}
      />
      <LectureMainGrid
        materials={materials}
        questions={questions}
        audio={audio}
        quizSummary={quizSummary}
      />
    </div>
  );
}
