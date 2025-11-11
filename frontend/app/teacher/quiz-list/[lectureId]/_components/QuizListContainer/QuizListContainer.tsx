"use client";
import React from "react";
import styles from "./QuizListContainer.module.scss";
import QuizSection from "../QuizSection/QuizSection";
import QuizInfo from "../QuizInfo/QuizInfo";

export default function QuizListContainer() {
  return (
    <div className={styles.quizListContainer}>
      <QuizInfo />
      <div className={styles.quizListContainerInner}>
        <QuizSection />
      </div>
    </div>
  );
}