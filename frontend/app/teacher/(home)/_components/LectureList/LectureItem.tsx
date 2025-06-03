import { Calendar, Clock, ChevronRight } from "lucide-react";
import styles from "./LectureList.module.scss";
import { FetchLecturesByDateResult } from "@/types/lectures/fetchLecturesByDate";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function LectureItem({
  lectureId,
  lectureName,
  className,
  lectureDate,
  startTime,
  endTime,
  status,
}: FetchLecturesByDateResult) {
  const router = useRouter();

  const handleClick = () => {
    router.push(ROUTES.teacherLectureDetail(lectureId));
  };

  return (
    <div className={styles.lectureItem} onClick={handleClick}>
      <div className={styles.lectureMain}>
        <div className={styles.lectureTitle}>
          <span className={styles.lectureTitleText}>{lectureName}</span>
          <span className={styles.className}>{className}</span>
        </div>
        <div className={styles.actionButton}>
          <span className={`${styles.buttonText} ${styles[status]}`}>
            {status === "beforeLecture" ? "강의 전" : "강의 종료"}
          </span>

          <div className={styles.buttonIcon}>
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
      <div className={styles.lectureInfo}>
        <div className={styles.infoItem}>
          <Calendar className={styles.icon} size={16} />
          <span className={styles.infoText}>{lectureDate}</span>
        </div>
        <div className={styles.infoItem}>
          <Clock className={styles.icon} size={16} />
          <span className={styles.infoText}>
            {startTime} - {endTime}
          </span>
        </div>
      </div>
    </div>
  );
}
