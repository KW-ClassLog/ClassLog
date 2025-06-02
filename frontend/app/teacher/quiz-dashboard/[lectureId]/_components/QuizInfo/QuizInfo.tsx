"use client";
import React from "react";
import styles from "./QuizInfo.module.scss";

const data = {
  title: "강의제목입니다~~",
  quizDate: "2025-04-14",
  quizDay: "월",
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
