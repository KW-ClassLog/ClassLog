"use client";
import React from "react";
import styles from "./QuizList.module.scss";

const data = {
  totalQuizCount: 4,
  quizList: [
    {
      quizId: "qz-001",
      quizOrder: 1,
      type: "multipleChoice",
      quizBody: "제가 제일 좋아하는 간식은 무엇일까요?",
      correctRate: 20.1,
      solution: "과자",
      options: [
        { optionOrder: 1, option: "과자", count: 20 },
        { optionOrder: 2, option: "사탕", count: 2 },
        { optionOrder: 3, option: "초콜릿", count: 0 },
        { optionOrder: 4, option: "젤리", count: 0 },
      ],
    },
    {
      quizId: "qz-002",
      quizOrder: 2,
      type: "trueFalse",
      quizBody: "저는 부자가 꿈입니다",
      correctRate: 20.1,
      solution: "O",
      options: [
        { optionOrder: null, option: "O", count: 50 },
        { optionOrder: null, option: "X", count: 2 },
      ],
    },
    {
      quizId: "qz-003",
      quizOrder: 3,
      type: "shortAnswer",
      quizBody: "저는 어느 지역에 거주할까요?",
      correctRate: 20.1,
      solution: "서울",
      count: 2,
    },
    {
      quizId: "qz-004",
      quizOrder: 4,
      type: "shortAnswer",
      quizBody: "안녕안녕안녕은 무엇일까요~? 단답형 문제임",
      correctRate: 20.1,
      solution: "하이",
      count: 2,
    },
  ],
};

function QuizCard({ quiz }: { quiz: any }) {
  return (
    <div className={styles.card}>
      <div className={styles.quizHeader}>
        <span className={styles.quizIndex}>퀴즈 {quiz.quizOrder}</span>
        <span className={styles.correctRate}>정답률 {quiz.correctRate}%</span>
      </div>
      <div className={styles.quizTitle}>{quiz.quizBody}</div>
      {quiz.type === "multipleChoice" && (
        <div className={styles.options}>
          {quiz.options.map((opt: any) => (
            <div
              key={opt.optionOrder}
              className={
                opt.option === quiz.solution
                  ? `${styles.option} ${styles.optionCorrect}`
                  : styles.option
              }
            >
              <span>
                {opt.optionOrder}번) {opt.option}
              </span>
              <span>{opt.count}명</span>
            </div>
          ))}
        </div>
      )}
      {quiz.type === "trueFalse" && (
        <div className={styles.oxRow}>
          {quiz.options.map((opt: any) => (
            <div
              key={opt.option}
              className={
                opt.option === quiz.solution
                  ? `${styles.oxBtn} ${styles.oxBtnCorrect}`
                  : styles.oxBtn
              }
            >
              <span>{opt.option}</span>
              <span style={{ marginLeft: 8 }}>{opt.count}명</span>
            </div>
          ))}
        </div>
      )}
      {quiz.type === "shortAnswer" && (
        <div className={styles.shortAnswer}>
          정답: {quiz.solution}
          <span className={styles.shortCount}>({quiz.count}명)</span>
        </div>
      )}
    </div>
  );
}

export default function QuizList() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.title}>퀴즈 목록</span>
        <span className={styles.count}>총 {data.totalQuizCount}문제</span>
      </div>
      <div className={styles.list}>
        {data.quizList.map((quiz) => (
          <QuizCard key={quiz.quizId} quiz={quiz} />
        ))}
      </div>
    </div>
  );
}
