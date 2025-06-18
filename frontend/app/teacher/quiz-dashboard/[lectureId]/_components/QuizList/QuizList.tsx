"use client";
import React from "react";
import styles from "./QuizList.module.scss";

interface QuizOption {
  optionOrder: number | null;
  option: string;
  count: number;
}

interface BaseQuiz {
  quizId: string;
  quizOrder: number;
  quizBody: string;
  correctRate: number;
  solution: string;
}

interface MultipleChoiceQuiz extends BaseQuiz {
  type: "multipleChoice";
  options: QuizOption[];
}

interface TrueFalseQuiz extends BaseQuiz {
  type: "trueFalse";
  options: QuizOption[];
}

interface ShortAnswerQuiz extends BaseQuiz {
  type: "shortAnswer";
  count: number;
}

type Quiz = MultipleChoiceQuiz | TrueFalseQuiz | ShortAnswerQuiz;

interface QuizListProps {
  quizList: Quiz[];
  totalQuizCount: number;
}

function QuizCard({ quiz }: { quiz: Quiz }) {
  return (
    <div className={styles.card}>
      <div className={styles.quizHeader}>
        <span className={styles.quizIndex}>퀴즈 {quiz.quizOrder}</span>
        <span className={styles.correctRate}>정답률 {quiz.correctRate}%</span>
      </div>
      <div className={styles.quizTitle}>{quiz.quizBody}</div>
      {quiz.type === "multipleChoice" && (
        <div className={styles.options}>
          {quiz.options.map((opt) => (
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
          {quiz.options.map((opt) => (
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

export default function QuizList({ quizList, totalQuizCount }: QuizListProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.title}>퀴즈 목록</span>
        <span className={styles.count}>총 {totalQuizCount}문제</span>
      </div>
      <div className={styles.list}>
        {quizList.map((quiz) => (
          <QuizCard key={quiz.quizId} quiz={quiz} />
        ))}
      </div>
    </div>
  );
}
