import { Calendar, Clock } from "lucide-react";
import styles from "./LectureItem.module.scss";
import { useState } from "react";
import MakeQuizModal from "@/components/Modal/MakeQuizModal/MakeQuizModal";

interface LectureItemProps {
  lectureId: string;
  title: string;
  lectureDate: string;
  status: "beforeLecture" | "showDashboard" | "quizCreation";
  startTime: string;
  endTime: string;
}

export default function LectureItem({
  lectureId,
  title,
  lectureDate,
  status,
  startTime,
  endTime,
}: LectureItemProps) {
  const [showQuizModal, setShowQuizModal] = useState(false);

  const getActionButton = (status: LectureItemProps["status"]) => {
    switch (status) {
      case "beforeLecture":
        return <div className={styles.beforeLecture}>강의 전</div>;
      case "showDashboard":
        return <button className={styles.showDashboard}>대시보드 확인</button>;
      case "quizCreation":
        return (
          <button
            className={styles.quizCreation}
            onClick={() => setShowQuizModal(true)}
          >
            퀴즈 생성하기
          </button>
        );
    }
  };

  return (
    <>
      <div className={styles.lectureItem}>
        <div className={styles.lectureInfo}>
          <span className={styles.title}>{title}</span>
          <div className={styles.dateTime}>
            <div className={styles.date}>
              <Calendar size={16} />
              <span>{lectureDate}</span>
            </div>
            <div className={styles.time}>
              <Clock size={16} />
              <span>
                {startTime} - {endTime} AM
              </span>
            </div>
          </div>
        </div>
        <div className={styles.action}>{getActionButton(status)}</div>
      </div>
      {showQuizModal && (
        <MakeQuizModal
          lectureId={lectureId}
          onClose={() => setShowQuizModal(false)}
        />
      )}
    </>
  );
}
