"use client";

import React, { useEffect, useState } from "react";
import styles from "./DashboardContainer.module.scss";
import QuizInfo from "../QuizInfo/QuizInfo";
import QuizSubmitList from "../QuizSubmitList/QuizSubmitList";
import QuizList from "../QuizList/QuizList";
import StatisticsContainer from "../StatisticsContainer/StatisticsContainer";
import { fetchQuizForDashboardResult } from "@/types/quizzes/fetchQuizForDashboardTypes";
import { fetchQuizForDashboard } from "@/api/quizzes/fetchQuizForDashboard";
import { useParams } from "next/navigation";

export default function DashboardContainer() {
  const [statData, setStatData] = useState<fetchQuizForDashboardResult | null>(
    null
  );
  const { lectureId } = useParams<{ lectureId: string }>();

  useEffect(() => {
    if (!lectureId) return;
    fetchQuizForDashboard(lectureId).then((res) => {
      if (res.isSuccess && res.result) {
        setStatData(res.result);
      } else {
        setStatData(null);
      }
    });
  }, [lectureId]);

  return (
    <div className={styles.dashboardContainer}>
      <QuizInfo />
      <div className={styles.dashboardContainerInner}>
        <section className={styles.leftSection}>
          <QuizSubmitList />
          <QuizList
            quizList={statData?.quizList || []}
            totalQuizCount={statData?.totalQuizCount || 0}
          />
        </section>
        <StatisticsContainer
          statData={
            statData || {
              averageCorrectRate: 0,
              totalQuizCount: 0,
              quizList: [],
            }
          }
        />
      </div>
    </div>
  );
}
