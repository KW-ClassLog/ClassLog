"use client";
import React from "react";
import styles from "./QuizInfo.module.scss";

const data = {
  title: "Ensemble 1",
  quizDate: "2025-06-03",
  quizDay: "화",
};

function formatDate(date: string, day: string) {
  const [yyyy, mm, dd] = date.split("-");
  return `${yyyy}.${mm}.${dd} (${day})`;
}

export default function QuizInfo() {
  return (
    <div className={styles.infoRow}>
      <div className={styles.title}>
        [{data.title}] <span className={styles.dashboard}>퀴즈 대시보드</span>
      </div>
      <div className={styles.date}>
        {formatDate(data.quizDate, data.quizDay)}
      </div>
    </div>
  );
}
