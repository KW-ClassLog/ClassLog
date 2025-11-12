"use client";
import React, { useEffect, useState } from "react";
import styles from "./QuizInfo.module.scss";
import { fetchQuizInfo } from "@/api/quizzes/fetchQuizInfo";
import { useParams } from "next/navigation";
import { fetchQuizInfoResult } from "@/types/quizzes/fetchQuizInfoTypes";

function formatDate(date: string, day: string) {
  const [yyyy, mm, dd] = date.split("-");
  return `${yyyy}.${mm}.${dd} (${day})`;
}

export default function QuizInfo() {
  const { lectureId } = useParams<{ lectureId: string }>();
  const [data, setData] = useState<fetchQuizInfoResult | null>(null);

  useEffect(() => {
    if (!lectureId) return;
    fetchQuizInfo(lectureId).then((res) => {
      if (res.isSuccess && res.result) {
        setData(res.result);
      } else {
        setData(null);
      }
    });
  }, [lectureId]);

  return (
    <div className={styles.infoRow}>
      {data && (
        <>
          <div className={styles.title}>
            [{data.title}]
            <span className={styles.dashboard}>퀴즈 대시보드</span>
          </div>
          <div className={styles.date}>
            {formatDate(data.quizDate, data.quizDay)}
          </div>
        </>
      )}
    </div>
  );
}
