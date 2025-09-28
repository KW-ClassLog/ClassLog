"use client";
import React, { useEffect, useState } from "react";
import { useLectureStatusStore } from "@/store/useLectureStatusStore";
import dayjs from "dayjs";
import { fetchQuizList } from "@/api/quizzes/fetchQuizList";
import { fetchQuizListResult } from "@/types/quizzes/fetchQuizListTypes";
import QuizToggleCard from "@/components/QuizToggleCard/QuizToggleCard";
import styles from "./QuizSection.module.scss";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import NoDataView from "@/components/NoDataView/NoDataView";
import { CheckCircle, Clock } from "lucide-react";
import FullWidthButton from "@/components/Button/FullWidthButton/FullWidthButton";

interface QuizSectionProps {
  lectureId: string;
}

export type QuizStatus = "notYet" | "solve" | "waitingResult" | "viewResult";

export default function QuizSection({ lectureId }: QuizSectionProps) {
  const { lectureStatus, lectureDate } = useLectureStatusStore();
  const [quizStatus, setQuizStatus] = useState<QuizStatus>("notYet");
  const [quizData, setQuizData] = useState<fetchQuizListResult | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [quizId: string]: string }>(
    {}
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const canViewResult = () => {
      if (!lectureDate) return false;
      const midnight = dayjs(lectureDate + " 00:00").add(1, "day");
      const now = dayjs(
        new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }))
      );
      return now.isAfter(midnight);
    };
    switch (lectureStatus) {
      case "beforeLecture":
      case "onLecture":
      case "afterLectureBeforeQuiz":
        setQuizStatus("notYet");
        break;
      case "quizReadyForSubmission":
        setQuizStatus("solve");
        break;
      case "viewMyQuizResult":
        if (canViewResult()) {
          setQuizStatus("viewResult");
        } else {
          setQuizStatus("waitingResult");
        }
        break;
    }
  }, [lectureStatus, lectureDate]);

  // quizStatus가 solve로 변경될 때 퀴즈 데이터 로드
  useEffect(() => {
    const loadQuizData = async () => {
      if (quizStatus !== "solve") return;

      setLoading(true);
      try {
        const response = await fetchQuizList(lectureId);
        if (response.isSuccess && response.result) {
          setQuizData(response.result);
        }
      } catch (error) {
        console.error("퀴즈 데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadQuizData();
  }, [quizStatus, lectureId]);

  // 퀴즈 답변 선택 핸들러
  const handleQuizSelect = (quizId: string, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [quizId]: answer,
    }));
  };

  // 단답형 퀴즈 입력 변경 핸들러
  const handleQuizInputChange = (quizId: string, inputAnswer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [quizId]: inputAnswer,
    }));
  };

  if (loading) {
    return <LoadingSpinner text="퀴즈를 불러오는 중..." />;
  }

  if (quizStatus === "notYet") {
    return (
      <div className={styles.quizSection}>
        <NoDataView
          icon={Clock}
          title="아직 퀴즈를 풀 수 없습니다."
          description="강의 시작 시간 전입니다."
        />
      </div>
    );
  }

  if (quizStatus === "waitingResult") {
    return (
      <div className={styles.quizSection}>
        <NoDataView
          icon={Clock}
          title="퀴즈 결과를 기다리는 중입니다."
          description="강의 종료 시간 전입니다."
        />
      </div>
    );
  }

  if (quizStatus === "viewResult") {
    return (
      <div className={styles.quizSection}>
        <NoDataView
          icon={CheckCircle}
          title="퀴즈 결과를 확인할 수 있습니다."
          description="강의 종료 시간 후입니다."
        />
      </div>
    );
  }

  return (
    <div className={styles.quizSection}>
      {quizStatus === "solve" && quizData && (
        <div className={styles.quizContainer}>
          {quizData.quizzes.map((quiz) => (
            <QuizToggleCard
              key={quiz.quizId}
              quizId={quiz.quizId}
              quizIndex={quiz.quizOrder}
              mode="quiz"
              type={quiz.type}
              question={quiz.quizBody}
              labels={
                quiz.type === "trueFalse"
                  ? ["O", "X"]
                  : quiz.options.map((option) => option.text)
              }
              onSelect={(label) => handleQuizSelect(quiz.quizId, label)}
              onInputChange={(inputAnswer) =>
                handleQuizInputChange(quiz.quizId, inputAnswer)
              }
            />
          ))}
        </div>
      )}
      <div className={styles.buttonContainer}>
        <FullWidthButton
          onClick={() => {}}
          disabled={
            Object.keys(userAnswers).length !== quizData?.quizzes.length
          }
        >
          퀴즈 제출
        </FullWidthButton>
      </div>
    </div>
  );
}
