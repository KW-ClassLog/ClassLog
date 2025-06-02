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
      <PieChart width={240} height={150}>
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
          wrapperStyle={{ right: 0, top: 15 }}
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
      <PieChart width={240} height={150}>
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
          wrapperStyle={{ right: 0, top: 45 }}
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
    </div>
  );
}

// 실제 QuizDetailChart 컴포넌트
export default function QuizDetailChart() {
  // 예시 퀴즈 데이터
  const quizzes: Quiz[] = [
    {
      quizId: "qz-001",
      quizOrder: 1,
      type: "multipleChoice",
      1: 20.0,
      2: 15.0,
      3: 5.0,
      4: 60.0,
    },
    {
      quizId: "qz-002",
      quizOrder: 2,
      type: "trueFalse",
      O: 75.0,
      X: 15.0,
    },
    {
      quizId: "qz-003",
      quizOrder: 3,
      type: "trueFalse",
      O: 75.0,
      X: 15.0,
    },
    {
      quizId: "qz-004",
      quizOrder: 4,
      type: "shortAnswer",
      top3Answers: [
        { answer: "서울", rate: 50.0 },
        { answer: "인천", rate: 10.0 },
        { answer: "수원", rate: 5.0 },
      ],
      etcAnswers: ["부산", "창원", "대구", "대전"],
    },
  ];

  return (
    <>
      {quizzes.map((quiz) => {
        if (quiz.type === "multipleChoice") {
          return <MultipleChoiceChart key={quiz.quizId} data={quiz} />;
        }
        if (quiz.type === "trueFalse") {
          return <TrueFalseChart key={quiz.quizId} data={quiz} />;
        }
        if (quiz.type === "shortAnswer") {
          return <ShortAnswerTop3 key={quiz.quizId} data={quiz} />;
        }
        return null;
      })}
    </>
  );
}
