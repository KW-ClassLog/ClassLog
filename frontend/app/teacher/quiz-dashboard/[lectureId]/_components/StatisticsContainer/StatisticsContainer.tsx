"use client";

import React, { useEffect, useState } from "react";
import QuizCorrectRates from "./QuizCorrectRates/QuizCorrectRates";
import AverageCorrectRate from "./AverageCorrectRate/AverageCorrectRate";
import QuizDetailChart from "./QuizDetailChart/QuizDetailChart";
import styles from "./StatisticsContainer.module.scss";
import Masonry from "react-masonry-css";
import {
  fetchQuizDetailStatResult,
  QuizDetailStat,
} from "@/types/quizzes/fetchQuizDetailStatTypes";
import { useParams } from "next/navigation";
import { fetchQuizDetailStat } from "@/api/quizzes/fetchQuizDetailStat";

interface StatData {
  averageCorrectRate: number;
  totalQuizCount: number;
  quizList: Array<{
    quizOrder: number;
    correctRate: number;
  }>;
}

interface StatisticsContainerProps {
  statData: StatData;
}

const result: fetchQuizDetailStatResult = [
  {
      "quizId": "22192e45-eb02-4df5-b426-cc69e5218a90",
      "quizOrder": 3,
      "type": "trueFalse",
      "X": 81.81,
      "O": 18.18
  },
  {
      "quizId": "42aa9553-bde9-4a39-8ede-a0a8d36d86f5",
      "quizOrder": 1,
      "type": "multipleChoice",
      "1": 0.0,
      "2": 9.09,
      "3": 9.09,
      "4": 81.81
  },
  {
      "quizId": "5161359d-e5fc-4995-adad-246565bfee63",
      "quizOrder": 4,
      "type": "shortAnswer",
      "top3Answers": [
          {
              "answer": "합성",
              "rate": 18.18
          },
          {
              "answer": "첨가 규칙",
              "rate": 18.18
          },
          {
              "answer": "첨가규칙",
              "rate": 18.18
          }
      ],
      "etcAnswers": [
          "R1(A, B), R2(A, C)",
          "첨가",
          "R1(A,B)",
          "Augumentation Rule",
          "합성규칙"
      ]
  },
  {
      "quizId": "847c296a-22bc-4ab7-828c-d1e3eda3a48e",
      "quizOrder": 2,
      "type": "shortAnswer",
      "top3Answers": [
          {
              "answer": "R1(A,B)",
              "rate": 36.36
          },
          {
              "answer": "R1(A,C)",
              "rate": 27.27
          },
          {
              "answer": "첨가 규칙",
              "rate": 18.18
          }
      ],
      "etcAnswers": [
          "R1(A,A)",
          "R1(C,A)"
      ]
  }
]

export default function StatisticsContainer({
  statData,
}: StatisticsContainerProps) {
  // 두 번째 데이터: 퀴즈별 분포/상세용
  const [detailData, setDetailData] =
    useState<fetchQuizDetailStatResult | null>(result);
  const { lectureId } = useParams<{ lectureId: string }>();

  // useEffect(() => {
  //   if (!lectureId) return;
  //   fetchQuizDetailStat(lectureId).then((res) => {
  //     if (res.isSuccess && res.result) {
  //       setDetailData(res.result);
  //     } else {
  //       setDetailData(null);
  //     }
  //   });
  // }, [lectureId]);

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
      {detailData && detailData.length > 0 ? (
        detailData.map((quiz: QuizDetailStat) => (
          <QuizDetailChart key={quiz.quizId} quiz={quiz} />
        ))
      ) : (
        <div className={styles.noData}>퀴즈 상세 통계 데이터가 없습니다.</div>
      )}
    </Masonry>
  );
}
