"use client";
import React from "react";
import QuizCorrectRates, {
  QuizType,
} from "./QuizCorrectRates/QuizCorrectRates";
import AverageCorrectRate from "./AverageCorrectRate/AverageCorrectRate";
import QuizDetailChart from "./QuizDetailChart/QuizDetailChart";
export default function StatisticsContainer() {
  // 예시 퀴즈 데이터
  const quizzes = [
    {
      quizId: "qz-001",
      type: "multipleChoice" as QuizType,
      1: 20.0,
      2: 15.0,
      3: 5.0,
      4: 60.0,
    },
    {
      quizId: "qz-002",
      type: "trueFalse" as QuizType,
      O: 75.0,
      X: 15.0,
    },
    {
      quizId: "qz-003",
      type: "shortAnswer" as QuizType,
      top3Answers: [
        { answer: "서울", rate: 50.0 },
        { answer: "인천", rate: 10.0 },
        { answer: "수원", rate: 5.0 },
      ],
    },
  ];
  return (
    <div>
      <AverageCorrectRate />
      <QuizCorrectRates />
      <QuizDetailChart quizzes={quizzes} />
    </div>
  );
}
