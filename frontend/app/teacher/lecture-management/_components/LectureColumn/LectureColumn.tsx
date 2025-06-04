import React from "react";
import styles from "./LectureColumn.module.scss";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { FetchLecturesByClassResult } from "@/types/classes/fetchLecturesByClassTypes";

interface LectureColumnProps {
  title: string;
  count: number;
  emptyText: string;
  lectures: FetchLecturesByClassResult[];
  columnClassName?: string;
}

const LectureColumn: React.FC<LectureColumnProps> = ({
  title,
  count,
  emptyText,
  lectures,
  columnClassName = "",
}) => {
  const router = useRouter();

  const handleLectureClick = (lectureId: string) => {
    router.push(ROUTES.teacherLectureDetail(lectureId));
  };

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
            <div
              key={l.lectureId}
              className={styles.lectureCard}
              onClick={() => handleLectureClick(l.lectureId)}
            >
              <div className={styles.lectureHeader}>
                <div className={styles.lectureTitle}>{l.lectureName}</div>
                <div className={styles.arrowButton}>
                  <ChevronRight color="#4894fe" size={20} />
                </div>
              </div>

              <div className={styles.lectureInfo}>
                <div className={styles.lectureDate}>
                  <Calendar size={16} />
                  {l.lectureDate}
                </div>
                <div className={styles.lectureTime}>
                  <Clock size={16} />
                  {l.startTime} - {l.endTime}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LectureColumn;
