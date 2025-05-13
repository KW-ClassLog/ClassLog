import { Calendar, Clock, ChevronRight } from "lucide-react";
import { useLectureStatus } from "@/hooks/useLectureStatus";
import styles from "./LectureList.module.scss";

interface LectureItemProps {
  lectureId: string;
  title: string;
  className: string;
  lectureDate: string;
  startTime: string;
  endTime: string;
}

export default function LectureItem({
  lectureId,
  title,
  className,
  lectureDate,
  startTime,
  endTime,
}: LectureItemProps) {
  const status = useLectureStatus({
    lectureDate,
    startTime,
    endTime,
  });

  return (
    <div className={styles.lectureItem}>
      <div className={styles.lectureMain}>
        <div className={styles.lectureTitle}>
          <span className={styles.lectureTitleText}>
            {lectureId}. {title}
          </span>
          <span className={styles.className}>{className}</span>
        </div>
        <div className={styles.actionButton}>
          <span
            className={`${styles.buttonText} ${
              styles[status.replace(" ", "")]
            }`}
          >
            {status}
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
