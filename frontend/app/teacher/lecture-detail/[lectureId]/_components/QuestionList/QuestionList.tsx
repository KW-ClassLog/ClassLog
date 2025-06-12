"use client";

import styles from "./QuestionList.module.scss";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useLectureDetail } from "../LectureDetailContext";

interface Question {
  sender: string;
  message: string;
  timestamp: string;
  profileUrl: string;
}

export default function QuestionList() {
  const { lectureId } = useLectureDetail();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: API 호출로 변경
    setQuestions([]);
    setLoading(false);
  }, [lectureId]);

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    } catch {
      return "00:00";
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>질문 목록</h2>
      <ul className={styles.questionList}>
        {questions.length === 0 ? (
          <div className={styles.emptyState}>등록된 질문이 없습니다.</div>
        ) : (
          questions.map((q, index) => (
            <li key={index} className={styles.questionItem}>
              <div className={styles.questionHeader}>
                <div className={styles.userInfo}>
                  <Image
                    src={q.profileUrl}
                    alt="프로필"
                    width={30}
                    height={30}
                    className={styles.profileImage}
                  />
                  <span className={styles.userName}>{q.sender}</span>
                </div>
                <span className={styles.timestamp}>
                  {formatTimestamp(q.timestamp)}
                </span>
              </div>
              <div className={styles.message}>{q.message}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
