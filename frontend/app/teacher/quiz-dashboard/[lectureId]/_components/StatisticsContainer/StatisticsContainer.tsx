"use client";
import React from "react";
import QuizCorrectRates from "./QuizCorrectRates/QuizCorrectRates";
import AverageCorrectRate from "./AverageCorrectRate/AverageCorrectRate";
import QuizDetailChart from "./QuizDetailChart/QuizDetailChart";
import styles from "./StatisticsContainer.module.scss";
import Masonry from "react-masonry-css";

interface StatisticsContainerProps {
  statData: any;
}

export default function StatisticsContainer({
  statData,
}: StatisticsContainerProps) {
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
      etcAnswers: ["부산", "창원", "대전", "대구"],
    },
  ];

  return (
    <Masonry
      breakpointCols={{ default: 2, 900: 1 }}
      className={styles.statisticsContainer}
      columnClassName={styles.statisticsColumn}
    >
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
    </Masonry>
  );
}
