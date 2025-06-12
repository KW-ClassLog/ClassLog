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
      1: 70.0,
      2: 20.0,
      3: 0.0,
      4: 10.0,
    },
    {
      quizId: "qz-002",
      quizOrder: 2,
      type: "trueFalse",
      O: 80.0,
      X: 20.0,
    },
    {
      quizId: "qz-003",
      quizOrder: 3,
      type: "shortAnswer",
      top3Answers: [
        { answer: "배깅", rate: 50.0 },
        { answer: "부스팅", rate: 20.0 },
        { answer: "스태킹", rate: 10.0 },
      ],
      etcAnswers: ["Voting", "랜덤포레스트"],
    },
    {
      quizId: "qz-004",
      quizOrder: 4,
      type: "shortAnswer",
      top3Answers: [
        { answer: "복원 추출", rate: 30.0 },
        { answer: "순차 샘플링", rate: 20.0 },
        { answer: "K-켭 교차 검증", rate: 10.0 },
      ],
      etcAnswers: ["부스트랩 샘플링", "계층 샘플링", "단순 샘플링"],
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
