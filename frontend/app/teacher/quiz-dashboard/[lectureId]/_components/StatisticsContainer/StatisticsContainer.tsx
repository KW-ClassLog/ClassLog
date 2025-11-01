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

export default function StatisticsContainer({
  statData,
}: StatisticsContainerProps) {
  // 두 번째 데이터: 퀴즈별 분포/상세용
  const [detailData, setDetailData] =
    useState<fetchQuizDetailStatResult | null>(null);
  const { lectureId } = useParams<{ lectureId: string }>();

  useEffect(() => {
    if (!lectureId) return;
    fetchQuizDetailStat(lectureId).then((res) => {
      if (res.isSuccess && res.result) {
        setDetailData(res.result);
      } else {
        setDetailData(null);
      }
    });
  }, [lectureId]);

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
