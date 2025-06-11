"use client";

import styles from "./QuizPreview.module.scss";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import SelectableButton from "@/components/Button/SelectableButton/SelectableButton";
import AlertModal from "@/components/Modal/AlertModal/AlertModal";
import { createQuiz } from "@/api/quizzes/createQuiz";
import { recreateQuiz } from "@/api/quizzes/recreateQuiz";
import { Quiz } from "@/types/quizzes/createQuizTypes";
import { useQuizStore } from "@/store/useQuizStore";

interface QuizPreviewProps {
  lectureId: string;
  useAudio: boolean;
  onCustomize?: (selectedQuizzes: Quiz[]) => void;
  onSubmit?: (quizzes: Quiz[]) => void;
  onClose?: () => void;
}

const QuizPreview = ({
  lectureId,
  useAudio,
  onCustomize,
  onSubmit,
  onClose,
}: QuizPreviewProps) => {
  // 퀴즈 스토어 사용
  const {
    selectedQuizzes,
    error,
    isLoading,
    isLoadingMore,
    setQuizzes,
    getQuizzes,
    toggleQuizSelection,
    setError,
    setIsLoading,
    setIsLoadingMore,
    addQuizzes,
  } = useQuizStore();

  const [showAlert, setShowAlert] = useState(false);

  // 현재 lectureId의 퀴즈 가져오기
  const quizzes = getQuizzes(lectureId);

  useEffect(() => {
    // 이미 퀴즈가 로드되어 있으면 다시 로드하지 않음
    if (quizzes !== null) return;

    setIsLoading(true);
    setError(null);
    createQuiz({ lectureId, useAudio })
      .then((res) => {
        if (res.isSuccess && res.result && Array.isArray(res.result.quizzes)) {
          setQuizzes(lectureId, res.result.quizzes);
        } else {
          setQuizzes(lectureId, []);
          setError(res.message || "퀴즈 생성에 실패했습니다.");
        }
      })
      .catch(() => {
        setQuizzes(lectureId, []);
        setError("퀴즈 생성 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [lectureId, useAudio, quizzes, setQuizzes, setError, setIsLoading]);

  const handleQuizSelection = (index: number) => {
    if (!quizzes) return;
    const quiz = quizzes[index];

    // 최대 4개 선택 제한 체크
    const exists = selectedQuizzes.some((q) => q === quiz);
    if (!exists && selectedQuizzes.length >= 4) {
      setShowAlert(true);
      return;
    }

    toggleQuizSelection(quiz);
  };

  const breakpointColumnsObj = {
    default: 2,
    800: 1,
  };

  const handleMoreQuiz = () => {
    if (!quizzes) return;

    setIsLoadingMore(true);
    setError(null);

    recreateQuiz({ lectureId, useAudio })
      .then((res) => {
        if (res.isSuccess && res.result && Array.isArray(res.result.quizzes)) {
          addQuizzes(lectureId, res.result.quizzes);
        } else {
          setError(res.message || "새로운 퀴즈 생성에 실패했습니다.");
        }
      })
      .catch(() => {
        setError("새로운 퀴즈 생성 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setIsLoadingMore(false);
      });
  };

  return (
    <div className={styles.wrapper}>
      {error && (
        <AlertModal
          onClose={() => {
            setError(null);
            if (onClose) onClose();
          }}
        >
          {error}
        </AlertModal>
      )}
      {showAlert && (
        <AlertModal onClose={() => setShowAlert(false)}>
          최대 4개의 퀴즈만 선택할 수 있습니다.
        </AlertModal>
      )}
      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.loading}>
            <LoadingSpinner
              text={["AI가 퀴즈를 만들고 있어요", "잠시만 기다려주세요!"]}
            />
          </div>
        ) : (
          <div className={styles.quizContainer}>
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className={styles.masonryGrid}
              columnClassName={styles.masonryColumn}
            >
              {quizzes?.map((quiz, index) => (
                <div
                  key={index}
                  className={`${styles.quizCard} ${
                    selectedQuizzes.includes(quiz) ? styles.selected : ""
                  }`}
                  onClick={() => handleQuizSelection(index)}
                >
                  <div className={styles.quizCardHeader}>
                    <div className={styles.type}>
                      {quiz.type === "multipleChoice"
                        ? "객관식"
                        : quiz.type === "shortAnswer"
                        ? "단답형"
                        : "O/X"}
                    </div>
                    <div className={styles.question}>{quiz.quizBody}</div>
                    <div className={styles.selectButtonWrapper}>
                      <SelectableButton
                        selected={selectedQuizzes.includes(quiz)}
                        onClick={(
                          e?: React.MouseEvent<Element, MouseEvent>
                        ) => {
                          e?.stopPropagation();
                          handleQuizSelection(index);
                        }}
                        disabled={false}
                      />
                    </div>
                  </div>
                  {quiz.type === "multipleChoice" &&
                    quiz.options &&
                    quiz.options.length > 0 && (
                      <ul className={styles.choices}>
                        {quiz.options.map((option, index) => (
                          <li key={index}>
                            {index + 1}. {option}
                          </li>
                        ))}
                      </ul>
                    )}
                  <div className={styles.answer}>정답: {quiz.solution}</div>
                </div>
              ))}
            </Masonry>
            <div className={styles.moreQuiz} onClick={handleMoreQuiz}>
              <p>
                {isLoadingMore
                  ? "추가 퀴즈를 생성하고 있어요..."
                  : "+ 다른 퀴즈도 보고싶어요"}
              </p>
            </div>
          </div>
        )}
      </div>
      {quizzes !== null && (
        <div className={styles.buttonSection}>
          <button
            className={styles.customizing}
            onClick={() => onCustomize && onCustomize(selectedQuizzes)}
            disabled={selectedQuizzes.length === 0}
          >
            선택한 퀴즈를 기반으로 커스터마이징 하기
          </button>
          <button
            className={styles.submit}
            onClick={() => {
              if (onSubmit && selectedQuizzes.length > 0) {
                onSubmit(selectedQuizzes);
              }
            }}
            disabled={selectedQuizzes.length === 0}
          >
            이대로 퀴즈 제출하기
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPreview;
