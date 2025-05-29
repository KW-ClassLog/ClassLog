"use client";
import React from "react";
import styles from "./DashboardContainer.module.scss";
import QuizInfo from "../QuizInfo/QuizInfo";
import QuizSubmitList from "../QuizSubmitList/QuizSubmitList";
import QuizList from "../QuizList/QuizList";
import StatisticsContainer from "../StatisticsContainer/StatisticsContainer";

export default function DashboardContainer() {
  return (
    <div className={styles.dashboardContainer}>
      <QuizInfo />
      <div className={styles.dashboardContainerInner}>
        <section className={styles.leftSection}>
          <QuizSubmitList />
          <QuizList />
        </section>
        <StatisticsContainer />
      </div>
    </div>
  );
}
