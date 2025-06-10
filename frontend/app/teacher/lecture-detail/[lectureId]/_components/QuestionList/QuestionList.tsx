"use client";

import styles from "./QuestionList.module.scss";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Question {
  sender: string;
  message: string;
  timestamp: string;
  profileUrl: string;
}

interface QuestionListProps {
  lectureId: string;
}

export default function QuestionList({ lectureId }: QuestionListProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: API 호출로 변경
    setQuestions([
      {
        sender: "user123",
        message: "안녕하세요!",
        timestamp: "2025-03-31T14:22:10",
        profileUrl: "/images/default_profile.jpg",
      },
      {
        sender: "user456",
        message: "반갑습니다 :)",
        timestamp: "2025-03-31T14:22:15",
        profileUrl: "/images/default_profile.jpg",
      },
      {
        sender: "student789",
        message:
          "강의 내용이 잘 이해되지 않아서 질문드립니다. 프로세스 스케줄링에 대해 더 자세히 설명해주실 수 있나요?",
        timestamp: "2025-03-31T14:25:30",
        profileUrl: "/images/default_profile.jpg",
      },
      {
        sender: "user123",
        message: "네, 좋은 질문이네요!",
        timestamp: "2025-03-31T14:26:45",
        profileUrl: "/images/default_profile.jpg",
      },
    ]);
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
                    width={24}
                    height={24}
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
