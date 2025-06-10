import { Calendar, Clock } from "lucide-react";
import styles from "./LectureItem.module.scss";
import { useState } from "react";
import MakeQuizModal from "@/components/Modal/MakeQuizModal/MakeQuizModal";

import { FetchQuizzesByClassResult } from "@/types/classes/fetchQuizzesByClassTypes";

import { useLectureStatusAction } from "@/hooks/useLectureStatusAction";

export default function LectureItem(lecture: FetchQuizzesByClassResult) {
  const [showQuizModal, setShowQuizModal] = useState(false);

  const actionConfig = useLectureStatusAction({
    status: lecture.status,
    lectureId: lecture.lectureId,
    lectureDate: lecture.date,
    setShowQuizModal,
  });

  const getActionButton = () => {
    if (!actionConfig) return null;

    if (actionConfig.className === "beforeLecture") {
      const IconComponent = actionConfig.icon;
      return (
        <span className={styles[actionConfig.className]}>
          {actionConfig.text}
          {IconComponent && <IconComponent size={16} />}
        </span>
      );
    }

    if (actionConfig.className) {
      const IconComponent = actionConfig.icon;
      return (
        <button
          className={styles[actionConfig.className]}
          onClick={actionConfig.onClick}
          disabled={actionConfig.disabled}
        >
          {actionConfig.text}
          {IconComponent && <IconComponent size={16} />}
        </button>
      );
    }

    return null;
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
        <div className={styles.action}>{getActionButton()}</div>
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
