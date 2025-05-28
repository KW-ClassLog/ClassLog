"use client";
import React from "react";
import QuizCorrectRates from "./QuizCorrectRates/QuizCorrectRates";
import AverageCorrectRate from "./AverageCorrectRate/AverageCorrectRate";
import QuizDetailChart, { Quiz } from "./QuizDetailChart/QuizDetailChart";
import styles from "./StatisticsContainer.module.scss";
export default function StatisticsContainer() {
  // 예시 퀴즈 데이터
  const quizzes = [
    {
      quizId: "qz-001",
      quizOrder: 1,
      type: "multipleChoice",
      1: 20.0,
      2: 15.0,
      3: 5.0,
      4: 60.0,
    },
    {
      quizId: "qz-002",
      quizOrder: 2,
      type: "trueFalse",
      O: 75.0,
      X: 15.0,
    },
    {
      quizId: "qz-003",
      quizOrder: 3,
      type: "trueFalse",
      O: 75.0,
      X: 15.0,
    },
    {
      quizId: "qz-004",
      quizOrder: 4,
      type: "shortAnswer",
      top3Answers: [
        { answer: "서울", rate: 50.0 },
        { answer: "인천", rate: 10.0 },
        { answer: "수원", rate: 5.0 },
      ],
    },
  ];
  return (
    <div className={styles.statisticsContainer}>
      <AverageCorrectRate />
      <QuizCorrectRates />
      <QuizDetailChart quizzes={quizzes as Quiz[]} />
    </div>
  );
}
