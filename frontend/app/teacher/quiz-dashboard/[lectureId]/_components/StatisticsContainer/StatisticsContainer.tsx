"use client";
import React from "react";
import QuizCorrectRates from "./QuizCorrectRates/QuizCorrectRates";
import AverageCorrectRate from "./AverageCorrectRate/AverageCorrectRate";
import QuizDetailChart from "./QuizDetailChart/QuizDetailChart";
import styles from "./StatisticsContainer.module.scss";
export default function StatisticsContainer() {
  // 실제 API에서 받아온 데이터 예시
  const data = {
    totalQuizCount: 4,
    averageCorrectRate: 85.0,
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
  return (
    <div className={styles.statisticsContainer}>
      <AverageCorrectRate
        averageCorrectRate={data.averageCorrectRate}
        totalQuizCount={data.totalQuizCount}
      />
      <QuizCorrectRates quizList={data.quizList} />
      <QuizDetailChart />
    </div>
  );
}
