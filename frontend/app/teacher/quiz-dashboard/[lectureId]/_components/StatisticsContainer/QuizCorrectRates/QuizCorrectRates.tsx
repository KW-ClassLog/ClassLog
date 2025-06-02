"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import styles from "./QuizCorrectRates.module.scss";

interface QuizCorrectRatesProps {
  quizList: { quizOrder: number; correctRate: number }[];
}

const COLORS = ["#FF7675", "#4F8CFF", "#00B894", "#6C5CE7"];

export default function QuizCorrectRates({ quizList }: QuizCorrectRatesProps) {
  const data = quizList.map((quiz) => ({
    name: `퀴즈 ${quiz.quizOrder}`,
    correctRate: quiz.correctRate,
  }));

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartTitle}>퀴즈별 정답률 분포</div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={32}>
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
          <Tooltip formatter={(value: number) => `${value}%`} />
          <Bar dataKey="correctRate">
            {data.map((_, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
