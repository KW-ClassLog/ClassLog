"use client";

import { useState } from "react";
import { Quiz } from "@/types/quizzes/createQuizTypes";
import ClosableModal from "@/components/Modal/ClosableModal/ClosableModal";
import BasicInput from "@/components/Input/BasicInput/BasicInput";
import styles from "./CustomizeQuizModal.module.scss";
import { useQuizStore } from "@/store/useQuizStore";
import { saveQuiz } from "@/api/quizzes/saveQuiz";
import AlertModal from "@/components/Modal/AlertModal/AlertModal";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

interface CustomizeQuizModalProps {
  quizzes: Quiz[];
  onClose: () => void;
  onGoBack: () => void;
  lectureId: string;
}

const CustomizeQuizModal = ({
  quizzes,
  onClose,
  onGoBack,
  lectureId,
}: CustomizeQuizModalProps) => {
  const [editedQuizzes, setEditedQuizzes] = useState<Quiz[]>(quizzes);
  const {
    resetLectureQuizzes,
    isSaving,
    saveSuccess,
    saveError,
    setIsSaving,
    setSaveSuccess,
    setSaveError,
  } = useQuizStore();

  const handleQuizChange = (idx: number, field: string, value: string) => {
    setEditedQuizzes((prev) =>
      prev.map((quiz, i) => (i === idx ? { ...quiz, [field]: value } : quiz))
    );
  };

  const handleClose = () => {
    // 선택 상태 초기화 (lectureId별로)
    resetLectureQuizzes(lectureId);
    onClose();
  };

  const handleGoBack = () => {
    // QuizPreview로 돌아가기 (선택 상태는 유지)
    onGoBack();
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    try {
      const res = await saveQuiz(lectureId, editedQuizzes);
      if (res && res.isSuccess) {
        setSaveSuccess(true);
      } else {
        setSaveError(res?.message || "퀴즈 저장에 실패했습니다.");
      }
    } catch {
      setSaveError("퀴즈 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderOXAnswer = (quiz: Quiz, idx: number) => (
    <div className={styles.answerRow}>
      <span className={styles.label}>정답 :</span>
      {["O", "X"].map((ox) => (
        <button
          key={ox}
          type="button"
          className={`${styles.answerBtn} ${
            quiz.solution === ox ? styles.selected : ""
          }`}
          onClick={() => handleQuizChange(idx, "solution", ox)}
        >
          {ox}
        </button>
      ))}
    </div>
  );

  const renderMultipleChoiceAnswer = (quiz: Quiz, idx: number) => (
    <div className={styles.answerRow}>
      <span className={styles.label}>정답 :</span>
      {quiz.options?.map((option, oIdx) => {
        const optionNumber = oIdx + 1;
        const isSelected = quiz.solution === option;

        return (
          <button
            key={oIdx}
            type="button"
            className={`${styles.answerBtn} ${
              isSelected ? styles.selected : ""
            }`}
            onClick={() => handleQuizChange(idx, "solution", option)}
          >
            {optionNumber}
          </button>
        );
      })}
    </div>
  );

  return (
    <ClosableModal onClose={handleClose}>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>퀴즈 커스터마이징</h2>
        <p className={styles.description}>
          퀴즈를 커스터마이징하여 수업에 적합한 퀴즈를 만들어보세요.
        </p>
        <div className={styles.quizList}>
          {editedQuizzes.map((quiz, idx) => (
            <div key={idx} className={styles.quizBox}>
              <div className={styles.labelRow}>
                <div className={styles.typeLabel}>
                  {quiz.type === "multipleChoice"
                    ? "객관식"
                    : quiz.type === "shortAnswer"
                    ? "단답형"
                    : "O/X"}
                </div>
                <BasicInput
                  value={quiz.quizBody}
                  onChange={(e) =>
                    handleQuizChange(idx, "quizBody", e.target.value)
                  }
                  placeholder="문제를 입력하세요"
                />
              </div>
              {quiz.type === "multipleChoice" && quiz.options && (
                <div className={styles.options}>
                  {quiz.options.map((option, oIdx) => (
                    <div key={oIdx} className={styles.optionRow}>
                      <span className={styles.optionNumber}>{oIdx + 1}</span>
                      <BasicInput
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(quiz.options || [])];
                          newOptions[oIdx] = e.target.value;
                          setEditedQuizzes((prev) =>
                            prev.map((q, i) =>
                              i === idx ? { ...q, options: newOptions } : q
                            )
                          );
                        }}
                        placeholder={`선택지 ${oIdx + 1}`}
                      />
                    </div>
                  ))}
                </div>
              )}
              {quiz.type === "shortAnswer" && (
                <div className={styles.labelRow}>
                  <span className={styles.label}>정답 :</span>
                  <BasicInput
                    value={quiz.solution}
                    onChange={(e) =>
                      handleQuizChange(idx, "solution", e.target.value)
                    }
                    placeholder="정답을 입력하세요"
                  />
                </div>
              )}
              {quiz.type === "trueFalse" && renderOXAnswer(quiz, idx)}
              {quiz.type === "multipleChoice" &&
                renderMultipleChoiceAnswer(quiz, idx)}
            </div>
          ))}
        </div>

        <div className={styles.buttonSection}>
          <button onClick={handleGoBack} className={styles.cancelButton}>
            이전
          </button>
          <button
            onClick={handleSubmit}
            className={styles.submitButton}
            disabled={isSaving}
          >
            퀴즈 제출하기
          </button>
        </div>
      </div>
      {isSaving && (
        <AlertModal hideButton onClose={() => {}}>
          <LoadingSpinner />
          <div style={{ marginTop: 16 }}>퀴즈 저장중...</div>
        </AlertModal>
      )}
      {saveSuccess && !isSaving && (
        <AlertModal onClose={handleClose}>
          퀴즈가 성공적으로 저장되었습니다.
        </AlertModal>
      )}
      {saveError && (
        <AlertModal onClose={() => setSaveError(null)}>{saveError}</AlertModal>
      )}
    </ClosableModal>
  );
};

export default CustomizeQuizModal;
