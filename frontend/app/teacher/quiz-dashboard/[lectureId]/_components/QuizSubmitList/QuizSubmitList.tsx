"use client";
import React from "react";
import styles from "./QuizSubmitList.module.scss";

const data = {
  submitNum: 10,
  studentList: [
    { name: "김클로", submitDate: "2025-06-03T15:23:00" },
    { name: "강백호", submitDate: "2025-06-03T15:23:50" },
    { name: "로하스", submitDate: "2025-06-03T15:26:45" },
    { name: "허경민", submitDate: "2025-06-03T15:29:23" },
    { name: "김민혁", submitDate: "2025-06-03T16:23:05" },
    { name: "장성우", submitDate: "2025-06-03T16:20:59" },
    { name: "천성호", submitDate: "2025-06-03T16:33:05" },
    { name: "배정대", submitDate: "2025-06-03T16:52:08" },
    { name: "김상수", submitDate: "2025-06-03T17:23:00" },
    { name: "윤준혁", submitDate: "2025-06-03T15:23:42" },
  ],
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const MM = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `25.${MM}.${dd} ${hh}:${mm}:${ss}`;
}

export default function QuizSubmitList() {
  return (
    <div className={styles.card}>
      <div className={styles.titleRow}>
        <span className={styles.title}>퀴즈 제출 명단</span>
        <span className={styles.count}>응답자 총 {data.submitNum}명</span>
      </div>
      <div className={styles.list}>
        {data.studentList.map((student, idx) => (
          <div
            className={
              idx === data.studentList.length - 1
                ? `${styles.row} ${styles.lastRow}`
                : styles.row
            }
            key={student.name + student.submitDate}
          >
            <span className={styles.name}>{student.name}</span>
            <span className={styles.date}>
              {formatDate(student.submitDate)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
