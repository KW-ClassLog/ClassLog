"use client";
import React from "react";

// 타입 정의 예시
export type QuizType = "multipleChoice" | "shortAnswer" | "trueFalse";
export interface Quiz {
  quizId: string;
  type: QuizType;
  [key: string]: unknown;
}

// 예시 차트 컴포넌트 (실제 구현은 별도 파일로 분리 가능)
function MultipleChoiceChart({ data }: { data: Quiz }) {
  return <div>퀴즈1 선택 분포 차트 (예시)</div>;
}
function TrueFalseChart({ data }: { data: Quiz }) {
  return <div>퀴즈2 OX 응답 비율 차트 (예시)</div>;
}
function ShortAnswerTop3({ data }: { data: Quiz }) {
  return <div>퀴즈3 상위 응답 TOP3 (예시)</div>;
}

// 실제 QuizCorrectRates 컴포넌트
export default function QuizDetailChart({ quizzes }: { quizzes: Quiz[] }) {
  return (
    <div>
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
    </div>
  );
}
