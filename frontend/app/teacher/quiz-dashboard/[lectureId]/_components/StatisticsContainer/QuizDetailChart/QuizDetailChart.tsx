"use client";
import React from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";
import styles from "./QuizDetailChart.module.scss";

// 타입 정의 예시
export type QuizType = "multipleChoice" | "shortAnswer" | "trueFalse";
export interface Quiz {
  quizId: string;
  quizOrder: number;
  type: QuizType;
  [key: string]: unknown;
}

// 색상 팔레트
const COLORS = ["#6C5CE7", "#4F8CFF", "#6AD1C9", "#B983FF"];
const OX_COLORS = ["#6AD1C9", "#4F8CFF"];

// MultipleChoiceChart: 파이차트
function MultipleChoiceChart({ data }: { data: Quiz }) {
  const chartData = [
    { name: "1번", value: Number(data["1"] ?? 0) },
    { name: "2번", value: Number(data["2"] ?? 0) },
    { name: "3번", value: Number(data["3"] ?? 0) },
    { name: "4번", value: Number(data["4"] ?? 0) },
  ];
  return (
    <div className={styles.chartCard}>
      <div className={styles.chartTitle}>퀴즈{data.quizOrder} 선택 분포</div>
      <PieChart width={230} height={140}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={60}
          dataKey="value"
        >
          {chartData.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          iconType="circle"
          iconSize={8}
          formatter={(value, entry, idx) => (
            <span style={{ marginLeft: "4px" }}>
              {chartData[idx].name} ({chartData[idx].value}%)
            </span>
          )}
        />
      </PieChart>
    </div>
  );
}

// TrueFalseChart: OX 파이차트
function TrueFalseChart({ data }: { data: Quiz }) {
  const chartData = [
    { name: "O", value: Number(data.O ?? 0) },
    { name: "X", value: Number(data.X ?? 0) },
  ];
  return (
    <div className={styles.chartCard}>
      <div className={styles.chartTitle}>퀴즈{data.quizOrder} OX 응답 비율</div>
      <PieChart width={230} height={140}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={60}
          dataKey="value"
        >
          {chartData.map((entry, idx) => (
            <Cell
              key={`cell-ox-${idx}`}
              fill={OX_COLORS[idx % OX_COLORS.length]}
            />
          ))}
        </Pie>
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          iconType="circle"
          iconSize={8}
          formatter={(value, entry, idx) => (
            <span style={{ marginLeft: "4px" }}>
              {chartData[idx].name} ({chartData[idx].value}%)
            </span>
          )}
        />
      </PieChart>
    </div>
  );
}

// ShortAnswerTop3: 리스트
function ShortAnswerTop3({ data }: { data: Quiz }) {
  const top3 = data.top3Answers as { answer: string; rate: number }[];
  const etcAnswers = data.etcAnswers as string[] | undefined;
  return (
    <div className={styles.chartCard}>
      <div className={styles.chartTitle}>
        퀴즈{data.quizOrder} 상위 응답 TOP3
      </div>
      <ul className={styles.top3List}>
        {top3.map((item, idx) => (
          <li key={item.answer} className={styles.top3Item}>
            <span>
              {idx + 1}. {item.answer}
            </span>
            <span>{item.rate}%</span>
          </li>
        ))}
      </ul>
      {etcAnswers && etcAnswers.length > 0 && (
        <div className={styles.etcAnswersBox}>
          <div className={styles.etcTitle}>기타 답변</div>
          <ul className={styles.etcList}>
            {etcAnswers.map((ans) => (
              <li key={ans} className={styles.etcItem}>
                {ans}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// 실제 QuizDetailChart 컴포넌트
export default function QuizDetailChart({ quiz }: { quiz: Quiz }) {
  if (quiz.type === "multipleChoice") {
    return <MultipleChoiceChart data={quiz} />;
  }
  if (quiz.type === "trueFalse") {
    return <TrueFalseChart data={quiz} />;
  }
  if (quiz.type === "shortAnswer") {
    return <ShortAnswerTop3 data={quiz} />;
  }
  return null;
}
