import React from "react";
import styles from "./LectureColumn.module.scss";

interface Lecture {
  lectureId: string;
  title: string;
  lectureDate: string;
  status: "beforeLecture" | "showDashboard" | "quizCreation";
  startTime: string;
  endTime: string;
}

interface LectureColumnProps {
  title: string;
  count: number;
  emptyText: string;
  lectures: Lecture[];
  columnClassName?: string;
}

const LectureColumn: React.FC<LectureColumnProps> = ({
  title,
  count,
  emptyText,
  lectures,
  columnClassName = "",
}) => {
  return (
    <div className={`${styles.lectureColumn} ${columnClassName}`}>
      <div className={styles.columnTitle}>
        {title} <span className={styles.count}>{count}건</span>
      </div>
      <div className={styles.lectureList}>
        {lectures.length === 0 ? (
          <div className={styles.emptyText}>{emptyText}</div>
        ) : (
          lectures.map((l) => (
            <div key={l.lectureId} className={styles.lectureCard}>
              <div className={styles.lectureTitle}>{l.title}</div>
              <div className={styles.lectureDate}>{l.lectureDate}</div>
              <div className={styles.lectureTime}>
                {l.startTime} - {l.endTime}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LectureColumn;
