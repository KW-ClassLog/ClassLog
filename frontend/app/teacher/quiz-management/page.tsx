"use client";

import styles from "./page.module.scss";
import useSelectedClassStore from "@/store/useSelectedClassStore";
import { useEffect, useState } from "react";
import LectureItem from "./_components/LectureItem/LectureItem";
import NoDataView from "@/components/NoDataView/NoDataView";
import { MessageCircleQuestion } from "lucide-react";
import { fetchQuizzesByClass } from "@/api/classes/fetchQuizzesByClass";
import { FetchQuizzesByClassResult } from "@/types/classes/fetchQuizzesByClassTypes";

export default function TeacherQuizManagementPage() {
  const { selectedClassId, selectedClassName } = useSelectedClassStore();
  const [lectures, setLectures] = useState<FetchQuizzesByClassResult[]>([]);

  useEffect(() => {
    if (selectedClassId) {
      fetchQuizzesByClass(selectedClassId).then((res) => {
        if (res.isSuccess && res.result) {
          setLectures(res.result);
        } else {
          setLectures([]);
        }
      });
    }
  }, [selectedClassId]);

  if (!selectedClassId || !selectedClassName) {
    return (
      <div className={styles.container}>
        <h1>퀴즈 관리</h1>
        <NoDataView
          icon={MessageCircleQuestion}
          title="선택된 클래스가 없습니다"
          description="좌상단의 클래스 선택 메뉴에서 클래스를 선택해주세요"
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>[{selectedClassName}] 퀴즈 관리</h1>
      <div className={styles.lectureList}>
        {lectures.map((lecture) => (
          <LectureItem
            key={lecture.lectureId}
            lectureId={lecture.lectureId}
            session={lecture.session}
            title={lecture.title}
            date={lecture.date}
            day={lecture.day}
            startTime={lecture.startTime}
            endTime={lecture.endTime}
            status={lecture.status}
          />
        ))}
      </div>
    </div>
  );
}
