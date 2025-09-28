"use client";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { CheckCircle, Clock } from "lucide-react";

// API
import { fetchQuizList } from "@/api/quizzes/fetchQuizList";
import { submitQuiz } from "@/api/quizzes/submitQuiz";

// Types
import { fetchQuizListResult } from "@/types/quizzes/fetchQuizListTypes";
import { SubmitQuizRequest } from "@/types/quizzes/submitQuizTypes";

// Components
import QuizToggleCard from "@/components/QuizToggleCard/QuizToggleCard";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import NoDataView from "@/components/NoDataView/NoDataView";
import AlertModal from "@/components/Modal/AlertModal/AlertModal";
import FullWidthButton from "@/components/Button/FullWidthButton/FullWidthButton";

// Store
import { useLectureStatusStore } from "@/store/useLectureStatusStore";

// Styles
import styles from "./QuizSection.module.scss";

interface QuizSectionProps {
  lectureId: string;
  onRefresh?: () => void;
}

export type QuizStatus =
  | "before"
  | "notYet"
  | "solve"
  | "waitingResult"
  | "viewResult";

export default function QuizSection({
  lectureId,
  onRefresh,
}: QuizSectionProps) {
  const { lectureStatus, lectureDate } = useLectureStatusStore();
  const [quizStatus, setQuizStatus] = useState<QuizStatus>("notYet");
  const [quizData, setQuizData] = useState<fetchQuizListResult | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [quizId: string]: string }>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // 강의 상태에 따른 퀴즈 상태 설정
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
        setQuizStatus("before");
        break;
      case "afterLectureBeforeQuiz":
        setQuizStatus("notYet");
        break;
      case "quizReadyForSubmission":
        setQuizStatus("solve");
        break;
      case "viewMyQuizResult":
        setQuizStatus(canViewResult() ? "viewResult" : "waitingResult");
        break;
    }
  }, [lectureStatus, lectureDate]);

  // 퀴즈 데이터 로드
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

  // 퀴즈 답변 핸들러
  const handleQuizSelect = (quizId: string, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [quizId]: answer,
    }));
  };

  const handleQuizInputChange = (quizId: string, inputAnswer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [quizId]: inputAnswer,
    }));
  };

  // 퀴즈 제출
  const handleSubmitQuiz = async () => {
    if (!quizData) return;

    setSubmitting(true);
    try {
      const submitData: SubmitQuizRequest = {
        answers: Object.entries(userAnswers).map(([quizId, answer]) => ({
          quizId,
          answer,
        })),
      };

      const response = await submitQuiz(submitData);

      if (response.isSuccess && response.result) {
        setResultMessage(
          "성공적으로 제출되었습니다. 12시 이후 퀴즈 결과를 확인할 수 있습니다."
        );
      } else {
        setResultMessage(response.message || "퀴즈 제출에 실패했습니다.");
      }
    } catch (error) {
      console.error("퀴즈 제출 오류:", error);
      setResultMessage("퀴즈 제출 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
      setShowResultModal(true);
    }
  };

  // 로딩 상태
  if (loading) {
    return <LoadingSpinner text="퀴즈를 불러오는 중..." />;
  }

  // 퀴즈 시작 전
  if (quizStatus === "before") {
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

  if (quizStatus === "notYet") {
    return (
      <div className={styles.quizSection}>
        <NoDataView
          icon={Clock}
          title="아직 퀴즈가 생성되지 않았습니다."
          description="강사가 퀴즈를 생성할 때까지 기다려주세요."
        />
      </div>
    );
  }

  // 결과 대기 중
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

  // 결과 확인 가능
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

  // 퀴즈 풀이 화면
  return (
    <div key={refreshKey} className={styles.quizSection}>
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
          onClick={handleSubmitQuiz}
          disabled={
            Object.keys(userAnswers).length !== quizData?.quizzes.length ||
            submitting
          }
        >
          {submitting ? "제출 중..." : "퀴즈 제출"}
        </FullWidthButton>
      </div>

      {showResultModal && (
        <AlertModal
          onClose={() => {
            setShowResultModal(false);
            setRefreshKey((prev) => prev + 1);
            onRefresh?.();
          }}
        >
          {resultMessage}
        </AlertModal>
      )}
    </div>
  );
}
