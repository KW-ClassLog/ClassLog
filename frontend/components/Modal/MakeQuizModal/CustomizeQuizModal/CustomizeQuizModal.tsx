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
import FitContentButton from "@/components/Button/FitContentButton/FitContentButton";
import { X } from "lucide-react";
import IconButton from "@/components/Button/IconButton/IconButton";

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
  // 기존 퀴즈의 객관식 정답을 선택지 번호로 변환
  const processedQuizzes = quizzes.map((quiz) => {
    if (quiz.type === "multipleChoice" && quiz.options && quiz.solution) {
      const solutionIndex = quiz.options.findIndex(
        (option) => option === quiz.solution
      );
      if (solutionIndex !== -1) {
        return {
          ...quiz,
          solution: (solutionIndex + 1).toString(),
        };
      }
    }
    return quiz;
  });

  const [editedQuizzes, setEditedQuizzes] = useState<Quiz[]>(processedQuizzes);
  const [userCreatedQuizzes, setUserCreatedQuizzes] = useState<Quiz[]>([]);
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

  const handleUserQuizChange = (idx: number, field: string, value: string) => {
    setUserCreatedQuizzes((prev) =>
      prev.map((quiz, i) => (i === idx ? { ...quiz, [field]: value } : quiz))
    );
  };

  const handleAddQuiz = () => {
    const newQuiz: Quiz = {
      quizBody: "",
      solution: "",
      type: "multipleChoice",
      options: ["", "", "", ""],
    };
    setUserCreatedQuizzes((prev) => [...prev, newQuiz]);
  };

  const handleRemoveUserQuiz = (idx: number) => {
    setUserCreatedQuizzes((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUserQuizTypeChange = (
    idx: number,
    type: "multipleChoice" | "shortAnswer" | "trueFalse"
  ) => {
    setUserCreatedQuizzes((prev) =>
      prev.map((quiz, i) => {
        if (i === idx) {
          const newQuiz = { ...quiz, type };
          if (type === "multipleChoice") {
            newQuiz.options = ["", "", "", ""];
            newQuiz.solution = "";
          } else if (type === "shortAnswer") {
            newQuiz.options = undefined;
            newQuiz.solution = "";
          } else if (type === "trueFalse") {
            newQuiz.options = undefined;
            newQuiz.solution = "";
          }
          return newQuiz;
        }
        return quiz;
      })
    );
  };

  const handleUserQuizOptionChange = (
    quizIdx: number,
    optionIdx: number,
    value: string
  ) => {
    setUserCreatedQuizzes((prev) =>
      prev.map((quiz, i) => {
        if (i === quizIdx && quiz.options) {
          const newOptions = [...quiz.options];
          newOptions[optionIdx] = value;
          return { ...quiz, options: newOptions };
        }
        return quiz;
      })
    );
  };

  const isQuizValid = (quiz: Quiz): boolean => {
    if (!quiz.quizBody.trim() || !quiz.solution.trim()) {
      return false;
    }

    if (quiz.type === "multipleChoice" && quiz.options) {
      return quiz.options.every((option) => option.trim() !== "");
    }

    return true;
  };

  const isAllQuizzesValid = (): boolean => {
    const allQuizzes = [...editedQuizzes, ...userCreatedQuizzes];
    return allQuizzes.every((quiz) => isQuizValid(quiz));
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
      const allQuizzes = [...editedQuizzes, ...userCreatedQuizzes];

      // 객관식 퀴즈의 정답을 선택지 번호에서 선택지 텍스트로 변환
      const processedQuizzes = allQuizzes.map((quiz) => {
        if (quiz.type === "multipleChoice" && quiz.options && quiz.solution) {
          const solutionNumber = parseInt(quiz.solution);
          if (
            !isNaN(solutionNumber) &&
            solutionNumber >= 1 &&
            solutionNumber <= quiz.options.length
          ) {
            return {
              ...quiz,
              solution: quiz.options[solutionNumber - 1],
            };
          }
        }
        return quiz;
      });

      const res = await saveQuiz(lectureId, processedQuizzes);
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

  const renderOXAnswer = (
    quiz: Quiz,
    idx: number,
    isUserCreated: boolean = false
  ) => (
    <div className={styles.answerRow}>
      <span className={styles.label}>정답 :</span>
      {["O", "X"].map((ox) => (
        <button
          key={ox}
          type="button"
          className={`${styles.answerBtn} ${
            quiz.solution === ox ? styles.selected : ""
          }`}
          onClick={() =>
            isUserCreated
              ? handleUserQuizChange(idx, "solution", ox)
              : handleQuizChange(idx, "solution", ox)
          }
        >
          {ox}
        </button>
      ))}
    </div>
  );

  const renderMultipleChoiceAnswer = (
    quiz: Quiz,
    idx: number,
    isUserCreated: boolean = false
  ) => (
    <div className={styles.answerRow}>
      <span className={styles.label}>정답 :</span>
      {quiz.options?.map((option, oIdx) => {
        const optionNumber = oIdx + 1;
        const isSelected = quiz.solution === optionNumber.toString();

        return (
          <button
            key={oIdx}
            type="button"
            className={`${styles.answerBtn} ${
              isSelected ? styles.selected : ""
            }`}
            onClick={() =>
              isUserCreated
                ? handleUserQuizChange(idx, "solution", optionNumber.toString())
                : handleQuizChange(idx, "solution", optionNumber.toString())
            }
          >
            {optionNumber}
          </button>
        );
      })}
    </div>
  );

  const renderQuizTypeSelector = (quiz: Quiz, idx: number) => (
    <div className={styles.typeSelector}>
      <span className={styles.label}>퀴즈 타입 :</span>
      {[
        { value: "multipleChoice", label: "객관식" },
        { value: "shortAnswer", label: "단답형" },
        { value: "trueFalse", label: "O/X" },
      ].map((type) => (
        <button
          key={type.value}
          type="button"
          className={`${styles.typeBtn} ${
            quiz.type === type.value ? styles.selected : ""
          }`}
          onClick={() =>
            handleUserQuizTypeChange(
              idx,
              type.value as "multipleChoice" | "shortAnswer" | "trueFalse"
            )
          }
        >
          {type.label}
        </button>
      ))}
    </div>
  );

  return (
    <ClosableModal onClose={handleClose}>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>퀴즈 커스터마이징</h2>
        <p className={styles.description}>
          퀴즈를 커스터마이징하여 수업에 적합한 퀴즈를 만들어보세요.
        </p>

        {/* 기존 퀴즈 목록 */}
        <div className={styles.quizList}>
          {editedQuizzes.map((quiz, idx) => (
            <div key={`edited-${idx}`} className={styles.quizBox}>
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

          {userCreatedQuizzes.length > 0 && (
            <div className={styles.userCreatedSection}>
              <h3 className={styles.sectionTitle}>직접 만든 퀴즈</h3>
              <div className={styles.quizList}>
                {userCreatedQuizzes.map((quiz, idx) => (
                  <div key={`user-${idx}`} className={styles.makingQuizBox}>
                    <div className={styles.quizHeader}>
                      {renderQuizTypeSelector(quiz, idx)}
                      <IconButton
                        icon={<X />}
                        onClick={() => handleRemoveUserQuiz(idx)}
                        ariaLabel="퀴즈 삭제"
                      />
                    </div>
                    <div className={styles.labelRow}>
                      <BasicInput
                        value={quiz.quizBody}
                        onChange={(e) =>
                          handleUserQuizChange(idx, "quizBody", e.target.value)
                        }
                        placeholder="문제를 입력하세요"
                      />
                    </div>
                    {quiz.type === "multipleChoice" && quiz.options && (
                      <div className={styles.options}>
                        {quiz.options.map((option, oIdx) => (
                          <div key={oIdx} className={styles.optionRow}>
                            <span className={styles.optionNumber}>
                              {oIdx + 1}
                            </span>
                            <BasicInput
                              value={option}
                              onChange={(e) =>
                                handleUserQuizOptionChange(
                                  idx,
                                  oIdx,
                                  e.target.value
                                )
                              }
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
                            handleUserQuizChange(
                              idx,
                              "solution",
                              e.target.value
                            )
                          }
                          placeholder="정답을 입력하세요"
                        />
                      </div>
                    )}
                    {quiz.type === "trueFalse" &&
                      renderOXAnswer(quiz, idx, true)}
                    {quiz.type === "multipleChoice" &&
                      renderMultipleChoiceAnswer(quiz, idx, true)}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className={styles.addQuizSection}>
            <FitContentButton onClick={handleAddQuiz}>
              + 퀴즈 직접 입력
            </FitContentButton>
          </div>
        </div>

        <div className={styles.buttonSection}>
          <button onClick={handleGoBack} className={styles.cancelButton}>
            이전
          </button>
          <button
            onClick={handleSubmit}
            className={styles.submitButton}
            disabled={isSaving || !isAllQuizzesValid()}
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
