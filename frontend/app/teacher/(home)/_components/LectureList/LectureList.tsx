"use client";

import styles from "./LectureList.module.scss";
import LectureItem from "./LectureItem";

interface Lecture {
  lectureId: string;
  title: string;
  className: string;
  lectureDate: string;
  startTime: string;
  endTime: string;
}

interface LectureListProps {
  lectures: Lecture[];
}

export default function LectureList({ lectures }: LectureListProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>강의 목록</h2>
      <div className={styles.lectureList}>
        {lectures.map((lecture) => (
          <LectureItem key={lecture.lectureId} {...lecture} />
        ))}
      </div>
    </div>
  );
}
