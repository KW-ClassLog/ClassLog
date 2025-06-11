"use client";

import { useState } from "react";
import { Quiz } from "@/types/quizzes/createQuizTypes";
import ClosableModal from "@/components/Modal/ClosableModal/ClosableModal";
import BasicInput from "@/components/Input/BasicInput/BasicInput";
import styles from "./CustomizeQuizModal.module.scss";

interface CustomizeQuizModalProps {
  quizzes: Quiz[];
  onSubmit: (quizzes: Quiz[]) => void;
  onClose: () => void;
}

const CustomizeQuizModal = ({
  quizzes,
  onSubmit,
  onClose,
}: CustomizeQuizModalProps) => {
  const [editedQuizzes, setEditedQuizzes] = useState<Quiz[]>(quizzes);

  const handleQuizChange = (idx: number, field: string, value: string) => {
    setEditedQuizzes((prev) =>
      prev.map((quiz, i) => (i === idx ? { ...quiz, [field]: value } : quiz))
    );
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
      {quiz.options?.map((_, oIdx) => (
        <button
          key={oIdx}
          type="button"
          className={`${styles.answerBtn} ${
            quiz.solution === String(oIdx + 1) ? styles.selected : ""
          }`}
          onClick={() => handleQuizChange(idx, "solution", String(oIdx + 1))}
        >
          {oIdx + 1}
        </button>
      ))}
    </div>
  );

  return (
    <ClosableModal onClose={onClose}>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>퀴즈 커스터마이징</h2>
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
        <div className={styles.buttonRow}>
          <button onClick={onClose} className={styles.cancelButton}>
            취소
          </button>
          <button
            onClick={() => onSubmit(editedQuizzes)}
            className={styles.submitButton}
          >
            퀴즈 제출하기
          </button>
        </div>
      </div>
    </ClosableModal>
  );
};

export default CustomizeQuizModal;
