"use client";

import { Quiz } from "@/types/quizzes/createQuizTypes";
import ClosableModal from "@/components/Modal/ClosableModal/ClosableModal";
import styles from "./QuizPreviewModal.module.scss";

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

    return (
      <div key={idx} className={styles.previewQuizBox}>
        <div className={styles.previewQuizHeader}>
          <div className={styles.previewTypeLabel}>
            {quiz.type === "multipleChoice"
              ? "객관식"
              : quiz.type === "shortAnswer"
              ? "단답형"
              : "O/X"}
          </div>
        </div>
        <div className={styles.previewQuestion}>{quiz.quizBody}</div>
        {quiz.type === "multipleChoice" && quiz.options && (
          <div className={styles.previewOptions}>
            {quiz.options.map((option, oIdx) => (
              <div key={oIdx} className={styles.previewOption}>
                {oIdx + 1}. {option}
              </div>
            ))}
          </div>
        )}
        <div className={styles.previewAnswer}>정답: {displaySolution}</div>
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
