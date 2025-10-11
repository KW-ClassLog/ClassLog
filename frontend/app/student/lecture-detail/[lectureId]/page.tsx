"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LectureInfoSection from "./_components/LectureInfoSection/LectureInfoSection";
import LectureNoteListSection from "./_components/LectureNoteListSection/LectureNoteListSection";
import QuestionListSection from "./_components/QuestionListSection/QuestionListSection";
import LecrureRecordSection from "./_components/LecrureRecordSection/LecrureRecordSection";
import QuizSection from "./_components/QuizSection/QuizSection";
import style from "./page.module.scss";
import Tab from "@/components/Tab/Tab";
import { useClassTitleStore } from "@/store/useClassTitleStore";
import { fetchClassNameByLectureId } from "@/api/classes/fetchClassNameByLectureId";

export default function StudentLectureDetailPage() {
  const params = useParams();
  const { setClassTitle } = useClassTitleStore();
  const lectureId = params.lectureId as string;
  const [selectedTab, setSelectedTab] = useState(0);
  const [quizRefreshKey, setQuizRefreshKey] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchClassNameByLectureId(lectureId);
        if (res.isSuccess) {
          setClassTitle(res.result?.className || "");
        }
      } catch (error) {
        console.error("클래스 이름을 불러오는 중 오류 발생:", error);
      }
    })();
  }, [lectureId, setClassTitle]);

  const tabs = ["수업 자료", "질문하기", "강의 녹음", "복습 퀴즈"];

  const handleTabSelect = (tabName: string) => {
    const tabIndex = tabs.indexOf(tabName);
    setSelectedTab(tabIndex);
  };

  const renderSection = () => {
    switch (selectedTab) {
      case 0:
        return <LectureNoteListSection lectureId={lectureId} />;
      case 1:
        return <QuestionListSection lectureId={lectureId} />;
      case 2:
        return <LecrureRecordSection lectureId={lectureId} />;
      case 3:
        return (
          <QuizSection
            key={quizRefreshKey}
            lectureId={lectureId}
            onRefresh={() => setQuizRefreshKey((prev) => prev + 1)}
          />
        );
      default:
        return <LectureNoteListSection lectureId={lectureId} />;
    }
  };

  return (
    <div className={style.lectureDetailPage}>
      <LectureInfoSection lectureId={lectureId} />
      <Tab tabs={tabs} onSelectTab={handleTabSelect} />
      <div className={style.content}>{renderSection()}</div>
    </div>
  );
}
