"use client";
import React from "react";
import styles from "./DashboardContainer.module.scss";
import QuizInfo from "../QuizInfo/QuizInfo";
import QuizSubmitList from "../QuizSubmitList/QuizSubmitList";
import QuizList from "../QuizList/QuizList";
import StatisticsContainer from "../StatisticsContainer/StatisticsContainer";

export default function DashboardContainer() {
  const statData = {
    totalQuizCount: 4,
    averageCorrectRate: 57.5,
    quizList: [
      {
        quizId: "qz-001",
        quizOrder: 1,
        type: "multipleChoice",
        quizBody: "앙상블 학습의 주요 목적 중 하나로 올바른 설명을 고르세요.",
        correctRate: 70.0,
        solution: "여러 모델을 결합해 오류를 줄이기 위해",
        options: [
          { optionOrder: 1, option: "여러 모델을 결합해 오류를 줄이기 위해", count: 7 },
          { optionOrder: 2, option: "하나의 모델 성능을 극단적으로 향상시키기 위해", count: 2 },
          { optionOrder: 3, option: "모델의 학습 속도를 높이기 위해", count: 0 },
          { optionOrder: 4, option: "데이터를 줄여 모델을 간소화하기 위해", count: 1 },
        ],
      },
      {
        quizId: "qz-002",
        quizOrder: 2,
        type: "trueFalse",
        quizBody: "Random Forest는 개별 트리의 가지치기를 수행하지 않는다.",
        correctRate: 80.0,
        solution: "O",
        options: [
          { optionOrder: null, option: "O", count: 8 },
          { optionOrder: null, option: "X", count: 2 },
        ],
      },
      {
        quizId: "qz-003",
        quizOrder: 3,
        type: "shortAnswer",
        quizBody: "앙상블 기법 중 여러 모델이 각자 예측한 결과를 다수결로 결정하는 방법은 무엇인가요?",
        correctRate: 50.0,
        solution: "배깅",
        count: 5,
      },
      {
        quizId: "qz-004",
        quizOrder: 4,
        type: "shortAnswer",
        quizBody: "Random Forest에서 개별 변수의 중요도를 평가할 때 사용하는 데이터 샘플링 기법은 무엇인가요?",
        correctRate: 30.0,
        solution: "복원 추출",
        count: 3,
      },
    ],
  };
  return (
    <div className={styles.dashboardContainer}>
      <QuizInfo />
      <div className={styles.dashboardContainerInner}>
        <section className={styles.leftSection}>
          <QuizSubmitList />
          <QuizList
            quizList={statData.quizList}
            totalQuizCount={statData.totalQuizCount}
          />
        </section>
        <StatisticsContainer statData={statData} />
      </div>
    </div>
  );
}
