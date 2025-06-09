"use client";

import styles from "./LectureMainGrid.module.scss";
import LectureMaterials from "../LectureMaterials/LectureMaterials";
import QuestionList from "../QuestionList/QuestionList";
import LectureRecording from "../LectureRecording/LectureRecording";

interface LectureMainGridProps {
  lectureId: string;
}

export default function LectureMainGrid({ lectureId }: LectureMainGridProps) {
  return (
    <div className={styles.grid}>
      <div className={styles.leftColumn}>
        <LectureMaterials lectureId={lectureId} />
        <LectureRecording lectureId={lectureId} />
      </div>
      <div className={styles.rightColumn}>
        <QuestionList lectureId={lectureId} />
      </div>
    </div>
  );
}
