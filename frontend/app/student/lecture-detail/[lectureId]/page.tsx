"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import LectureInfoSection from "./_components/LectureInfoSection/LectureInfoSection";
import LectureNoteListSection from "./_components/LectureNoteListSection/LectureNoteListSection";
import QuestionListSection from "./_components/QuestionListSection/QuestionListSection";
import LecrureRecordSection from "./_components/LecrureRecordSection/LecrureRecordSection";
import QuizSection from "./_components/QuizSection/QuizSection";
import style from "./page.module.scss";
import Tab from "@/components/Tab/Tab";
import { useClassTitleStore } from "@/store/useClassTitleStore";

export default function StudentLectureDetailPage() {
  const params = useParams();
  const { setClassTitle } = useClassTitleStore();
  const lectureId = params.lectureId as string;
  const [selectedTab, setSelectedTab] = useState(0);

  // TODO: lectureId로 클래스타이틀 불러오고, 이를 setClassTitle 이용해서 스토어에 저장해야 함

  const tabs = ["수업 자료", "질문하기", "강의 녹음", "복습 퀴즈"];

  const handleTabSelect = (tabName: string) => {
    const tabIndex = tabs.indexOf(tabName);
    setSelectedTab(tabIndex);
  };

  const renderSection = () => {
    switch (selectedTab) {
      case 0:
        return <LectureNoteListSection />;
      case 1:
        return <QuestionListSection />;
      case 2:
        return <LecrureRecordSection />;
      case 3:
        return <QuizSection />;
      default:
        return <LectureNoteListSection />;
    }
  };

  return (
    <div className={style.lectureDetailPage}>
      <LectureInfoSection lectureId={lectureId} />
      <Tab tabs={tabs} onSelectTab={handleTabSelect} />
      {renderSection()}
    </div>
  );
}
