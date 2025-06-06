import { Calendar, Clock } from "lucide-react";
import styles from "./LectureItem.module.scss";
import { useState } from "react";
import MakeQuizModal from "@/components/Modal/MakeQuizModal/MakeQuizModal";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { FetchQuizzesByClassResult } from "@/types/classes/fetchQuizzesByClassTypes";
import dayjs from "dayjs";

export default function LectureItem(lecture: FetchQuizzesByClassResult) {
  const [showQuizModal, setShowQuizModal] = useState(false);
  const router = useRouter();

  const getActionButton = (status: string) => {
    switch (status) {
      case "beforeLecture":
        return <div className={styles.beforeLecture}>강의 전</div>;
      case "checkDashboard": {
        const now = dayjs();
        const lectureDate = dayjs(lecture.date, "YYYY-MM-DD");
        const isToday = now.isSame(lectureDate, "day");
        const midnight = lectureDate.add(1, "day").startOf("day");
        const isBeforeMidnight = now.isBefore(midnight);
        if (isToday && isBeforeMidnight) {
          return (
            <button className={styles.showDashboardNotYet} disabled>
              오늘 밤 12:00 확인 가능
            </button>
          );
        }
        return (
          <button
            className={styles.showDashboard}
            onClick={() =>
              router.push(ROUTES.teacherQuizDashboard(lecture.lectureId))
            }
          >
            대시보드 확인
          </button>
        );
      }
      case "makeQuiz":
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
          <span className={styles.title}>
            {lecture.session}. {lecture.title}
          </span>
          <div className={styles.dateTime}>
            <div className={styles.date}>
              <Calendar size={16} />
              <span>{`${lecture.date} (${lecture.day})`}</span>
            </div>
            <div className={styles.time}>
              <Clock size={16} />
              <span>
                {lecture.startTime} - {lecture.endTime}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.action}>{getActionButton(lecture.status)}</div>
      </div>
      {showQuizModal && (
        <MakeQuizModal
          lectureId={lecture.lectureId}
          onClose={() => setShowQuizModal(false)}
        />
      )}
    </>
  );
}
