"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.scss";
import DateSelector from "./_components/DateSelector/DateSelector";
import LectureList from "./_components/LectureList/LectureList";
import ClassList from "./_components/ClassList/ClassList";
import { fetchLecturesByDate } from "@/api/lectures/fetchLecturesByDate";
import { FetchLecturesByDateResult } from "@/types/lectures/fetchLecturesByDate";
import { format } from "date-fns";

export default function TeacherHomePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [lectures, setLectures] = useState<FetchLecturesByDateResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const res = await fetchLecturesByDate(dateStr);
      if (res && res.isSuccess) {
        setLectures(res.result || []);
      } else {
        setError(res?.message || "강의 목록을 불러오지 못했습니다.");
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedDate]);

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div className={styles.scheduleContainer}>
          <DateSelector
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
          <LectureList lectures={lectures} loading={loading} error={error} />
        </div>
      </div>
      <div className={styles.rightSection}>
        <ClassList />
      </div>
    </div>
  );
}
