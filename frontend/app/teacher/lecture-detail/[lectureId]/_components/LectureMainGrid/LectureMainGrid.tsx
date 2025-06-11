"use client";

import styles from "./LectureMainGrid.module.scss";
import LectureMaterials from "../LectureMaterials/LectureMaterials";
import QuestionList from "../QuestionList/QuestionList";
import LectureRecording from "../LectureRecording/LectureRecording";

export default function LectureMainGrid() {
  return (
    <div className={styles.grid}>
      <div className={styles.leftColumn}>
        <LectureMaterials />
        <LectureRecording />
      </div>
      <div className={styles.rightColumn}>
        <QuestionList />
      </div>
    </div>
  );
}
