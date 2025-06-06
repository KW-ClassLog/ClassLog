"use client";

import styles from "./page.module.scss";
import useSelectedClassStore from "@/store/useSelectedClassStore";
import { useEffect, useState } from "react";
import LectureItem from "./_components/LectureItem/LectureItem";
import NoDataView from "@/components/NoDataView/NoDataView";
import { MessageCircleQuestion } from "lucide-react";

interface Lecture {
  lectureId: string;
  title: string;
  lectureDate: string;
  status: "beforeLecture" | "showDashboard" | "quizCreation";
  startTime: string;
  endTime: string;
}

export default function TeacherQuizManagementPage() {
  const { selectedClassId, selectedClassName } = useSelectedClassStore();
  const [lectures, setLectures] = useState<Lecture[]>([
    {
      lectureId: "1",
      title: "1주차",
      lectureDate: "2025.03.18 (화)",
      status: "beforeLecture",
      startTime: "10:30",
      endTime: "11:45",
    },
    {
      lectureId: "2",
      title: "2주차",
      lectureDate: "2025.03.18 (화)",
      status: "showDashboard",
      startTime: "10:30",
      endTime: "11:45",
    },
    {
      lectureId: "3",
      title: "3주차",
      lectureDate: "2025.03.18 (화)",
      status: "quizCreation",
      startTime: "10:30",
      endTime: "11:45",
    },
    {
      lectureId: "4",
      title: "4주차",
      lectureDate: "2025.03.18 (화)",
      status: "beforeLecture",
      startTime: "10:30",
      endTime: "11:45",
    },
  ]);

  useEffect(() => {
    if (selectedClassId) {
      // TODO: API 호출하여 해당 클래스의 강의 목록을 가져옴
      console.log("Selected Class ID:", selectedClassId);
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
          <LectureItem key={lecture.lectureId} {...lecture} />
        ))}
      </div>
    </div>
  );
}
