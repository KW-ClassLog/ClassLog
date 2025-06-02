"use client";
import React from "react";
import QuizCorrectRates from "./QuizCorrectRates/QuizCorrectRates";
import AverageCorrectRate from "./AverageCorrectRate/AverageCorrectRate";
import QuizDetailChart from "./QuizDetailChart/QuizDetailChart";
import styles from "./StatisticsContainer.module.scss";

export default function StatisticsContainer() {
  // 첫 번째 데이터: 통계용
  const statData = {
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
        correctRate: 26.1,
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
        correctRate: 70.1,
        solution: "서울",
        count: 2,
      },
      {
        quizId: "qz-004",
        quizOrder: 4,
        type: "shortAnswer",
        quizBody: "안녕안녕안녕은 무엇일까요~? 단답형 문제임",
        correctRate: 30.1,
        solution: "하이",
        count: 2,
      },
    ],
  };

  // 두 번째 데이터: 퀴즈별 분포/상세용
  const detailData = [
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
      type: "shortAnswer",
      top3Answers: [
        { answer: "서울", rate: 50.0 },
        { answer: "인천", rate: 10.0 },
        { answer: "수원", rate: 5.0 },
      ],
      etcAnswers: ["부산", "창원", "대전", "대구"],
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
      etcAnswers: [
        "부산",
        "창원",
        "대전",
        "대구",
        "부산",
        "창원",
        "대전",
        "대구",
        ,
        "부산",
        "창원",
        "대전",
        "대구",
      ],
    },
  ];

  return (
    <div className={styles.statisticsContainer}>
      <AverageCorrectRate
        averageCorrectRate={statData.averageCorrectRate}
        totalQuizCount={statData.totalQuizCount}
      />
      <QuizCorrectRates quizList={statData.quizList} />
      {detailData.map((quiz) => (
        <QuizDetailChart
          key={quiz.quizId}
          quiz={{
            ...quiz,
            type: quiz.type as "multipleChoice" | "trueFalse" | "shortAnswer",
          }}
        />
      ))}
    </div>
  );
}
