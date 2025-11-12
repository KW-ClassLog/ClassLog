"use client";
import React, { useEffect, useState } from "react";
import styles from "./QuizSubmitList.module.scss";
import { fetchQuizSubmitListResult } from "@/types/quizzes/fetchSubmitListTypes";
import { fetchSubmitList } from "@/api/quizzes/fetchSubmitList";
import { useParams } from "next/navigation";

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
  const [data, setData] = useState<fetchQuizSubmitListResult | null>(null);
  const { lectureId } = useParams<{ lectureId: string }>();
  useEffect(() => {
    if (!lectureId) return;
    fetchSubmitList(lectureId).then((res) => {
      if (res.isSuccess && res.result) {
        setData(res.result);
      } else {
        setData(null);
      }
    });
  }, [lectureId]);

  return (
    <div className={styles.card}>
      {data && (
        <>
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
        </>
      )}
    </div>
  );
}
