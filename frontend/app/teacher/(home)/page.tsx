"use client";

import { useState } from "react";
import styles from "./page.module.scss";
import DateSelector from "./_components/DateSelector/DateSelector";
import LectureList from "./_components/LectureList/LectureList";
import ClassList from "./_components/ClassList/ClassList";

const mockLectures = [
  {
    lectureId: "1",
    title: "ADT",
    className: "자료구조",
    lectureDate: "2024.03.18 (월)",
    startTime: "10:30",
    endTime: "11:45",
  },
  {
    lectureId: "2",
    title: "ADT",
    className: "자료구조",
    lectureDate: "2024.03.18 (월)",
    startTime: "10:30",
    endTime: "11:45",
  },
  // 더 많은 강의 데이터를 추가할 수 있습니다
];

export default function TeacherHomePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div className={styles.scheduleContainer}>
          <DateSelector
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
          <LectureList lectures={mockLectures} />
        </div>
      </div>
      <div className={styles.rightSection}>
        <ClassList />
      </div>
    </div>
  );
}
