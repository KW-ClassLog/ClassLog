"use client";

import { Quiz } from "@/types/quizzes/createQuizTypes";
import ClosableModal from "@/components/Modal/ClosableModal/ClosableModal";
import styles from "./QuizPreviewModal.module.scss";
import { CircleCheck } from "lucide-react";
import QuizInput from "@/components/Input/QuizInput/QuizInput";
import QuizChoiceButton from "@/components/Button/QuizChoiceButton/QuizChoiceButton";

interface QuizPreviewModalProps {
  quizzes: Quiz[];
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  title?: string;
  description?: string;
  cancelButtonText?: string;
  submitButtonText?: string;
}

const QuizPreviewModal = ({
  quizzes,
  onClose,
  onSubmit,
  isSubmitting = false,
  title = "퀴즈 최종 확인",
  description = "아래 퀴즈들이 최종 제출됩니다. 확인 후 제출해주세요.",
  cancelButtonText = "다시 수정하기",
  submitButtonText = "이대로 제출하기",
}: QuizPreviewModalProps) => {
  const renderPreviewQuiz = (quiz: Quiz, idx: number) => {
    // 객관식 퀴즈의 정답을 선택지 번호에서 선택지 텍스트로 변환
    let displaySolution = quiz.solution;
    if (quiz.type === "multipleChoice" && quiz.options && quiz.solution) {
      const solutionNumber = parseInt(quiz.solution);
      if (
        !isNaN(solutionNumber) &&
        solutionNumber >= 1 &&
        solutionNumber <= quiz.options.length
      ) {
        displaySolution = quiz.options[solutionNumber - 1];
      }
    }

    // OX 문제는 labels를 ["O", "X"]로 자동 설정
    const getLabels = () => {
      if (quiz.type === "trueFalse" && !quiz.options) {
        return ["O", "X"];
      }
      return quiz.options;
    };

    return (
      <div key={idx} className={styles.card}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <CircleCheck
              className={styles.checkIcon}
              size={24}
              color="#4894FE"
            />
            <h1 className={styles.index}>퀴즈 {idx + 1}</h1>
          </div>
        </div>
        <div className={styles.content}>
          <h2 className={styles.quizTitle}>{quiz.quizBody}</h2>
          <div className={styles.quizContent}>
            {quiz.type === "multipleChoice" || quiz.type === "trueFalse" ? (
              <div className={styles.choiceButtons}>
                {getLabels()?.map((label) => (
                  <QuizChoiceButton
                    key={label}
                    label={label}
                    correctAnswer={displaySolution}
                    mode="teacher"
                  />
                ))}
              </div>
            ) : (
              <QuizInput
                mode="teacher"
                correctAnswer={displaySolution}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <ClosableModal onClose={onClose}>
      <div className={styles.previewWrapper}>
        <h2 className={styles.previewTitle}>{title}</h2>
        <p className={styles.previewDescription}>{description}</p>

        <div className={styles.previewQuizList}>
          {quizzes.map((quiz, idx) => renderPreviewQuiz(quiz, idx))}
        </div>

        <div className={styles.previewButtonSection}>
          <button
            onClick={onClose}
            className={styles.previewCancelButton}
            disabled={isSubmitting}
          >
            {cancelButtonText}
          </button>
          <button
            onClick={onSubmit}
            className={styles.previewSubmitButton}
            disabled={isSubmitting}
          >
            {submitButtonText}
          </button>
        </div>
      </div>
    </ClosableModal>
  );
};

export default QuizPreviewModal;
