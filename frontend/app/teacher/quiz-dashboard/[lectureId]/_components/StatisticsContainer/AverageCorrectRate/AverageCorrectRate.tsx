"use client";
import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import styles from "./AverageCorrectRate.module.scss";

interface AverageCorrectRateProps {
  averageCorrectRate: number;
  totalQuizCount: number;
}

const COLORS = ["#4F8CFF", "#E0E7EF"];

export default function AverageCorrectRate({
  averageCorrectRate,
  totalQuizCount,
}: AverageCorrectRateProps) {
  const data = [
    { name: "정답률", value: averageCorrectRate },
    { name: "오답률", value: 100 - averageCorrectRate },
  ];
  return (
    <div className={styles.chartCard}>
      <PieChart width={120} height={120}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={35}
          outerRadius={48}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
        >
          {data.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
      <div>
        <div className={styles.chartTitle}>
          평균 정답률 {averageCorrectRate}%
        </div>
        <div className={styles.averageCorrectRateTextBox}>
          총 {totalQuizCount}문제 중 평균{" "}
          {((totalQuizCount * averageCorrectRate) / 100).toFixed(1)}개 정답
        </div>
      </div>
    </div>
  );
}
