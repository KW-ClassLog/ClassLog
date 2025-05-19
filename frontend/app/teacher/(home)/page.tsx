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

const mockClasses = [
  {
    classId: "1",
    className: "자료구조",
    classDate: "월 (10:15-11:45) / 수 (12:00-13:15)",
    startDate: "2024.03.04",
    endDate: "2025.06.13",
  },
  {
    classId: "2",
    className: "자료구조",
    classDate: "월 (10:15-11:45) / 수 (12:00-13:15)",
    startDate: "2024.03.04",
    endDate: "2025.06.13",
  },
  {
    classId: "3",
    className: "자료구조",
    classDate: "월 (10:15-11:45) / 수 (12:00-13:15)",
    startDate: "2024.03.04",
    endDate: "2025.06.13",
  },
  {
    classId: "4",
    className: "자료구조",
    classDate: "월 (10:15-11:45) / 수 (12:00-13:15)",
    startDate: "2024.03.04",
    endDate: "2025.06.13",
  },
  {
    classId: "5",
    className: "자료구조",
    classDate: "월 (10:15-11:45) / 수 (12:00-13:15)",
    startDate: "2024.03.04",
    endDate: "2025.06.13",
  },
  {
    classId: "6",
    className: "자료구조",
    classDate: "월 (10:15-11:45) / 수 (12:00-13:15)",
    startDate: "2024.03.04",
    endDate: "2025.06.13",
  },
  {
    classId: "7",
    className: "자료구조",
    classDate: "월 (10:15-11:45) / 수 (12:00-13:15)",
    startDate: "2024.03.04",
    endDate: "2025.06.13",
  },
  {
    classId: "8",
    className: "자료구조",
    classDate: "월 (10:15-11:45) / 수 (12:00-13:15)",
    startDate: "2024.03.04",
    endDate: "2025.06.13",
  },
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
        <ClassList classes={mockClasses} />
      </div>
    </div>
  );
}
