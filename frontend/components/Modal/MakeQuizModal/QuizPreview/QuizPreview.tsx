// _components/QuizPreview.tsx
import styles from "./QuizPreview.module.scss";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import SelectableButton from "@/components/Button/SelectableButton/SelectableButton";
import AlertModal from "@/components/Modal/AlertModal/AlertModal";
import { createQuiz } from "@/api/quizzes/createQuiz";
import { recreateQuiz } from "@/api/quizzes/recreateQuiz";
import { Quiz } from "@/types/quizzes/createQuizTypes";

interface QuizPreviewProps {
  lectureId: string;
  useAudio: boolean;
  onCustomize?: () => void;
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
  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuizzes, setSelectedQuizzes] = useState<Quiz[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setQuizzes(null); // 로딩 상태
    setError(null); // 에러 초기화
    createQuiz({ lectureId, useAudio })
      .then((res) => {
        if (res.isSuccess && res.result && Array.isArray(res.result.quizzes)) {
          setQuizzes(res.result.quizzes);
        } else {
          setQuizzes([]);
          setError(res.message || "퀴즈 생성에 실패했습니다.");
        }
      })
      .catch(() => {
        setQuizzes([]);
        setError("퀴즈 생성 중 오류가 발생했습니다.");
      });
  }, [lectureId, useAudio]);

  const toggleQuizSelection = (index: number) => {
    if (!quizzes) return;
    const quiz = quizzes[index];
    setSelectedQuizzes((prev) => {
      const exists = prev.some((q) => q === quiz);
      if (exists) {
        return prev.filter((q) => q !== quiz);
      } else {
        if (prev.length >= 4) {
          setShowAlert(true);
          return prev;
        }
        return [...prev, quiz];
      }
    });
  };

  const breakpointColumnsObj = {
    default: 2,
    800: 1,
  };

  const handleMoreQuiz = () => {
    if (!quizzes) return;

    setIsLoadingMore(true); // 추가 로딩 상태
    setError(null); // 에러 초기화

    recreateQuiz({ lectureId, useAudio })
      .then((res) => {
        if (res.isSuccess && res.result && Array.isArray(res.result.quizzes)) {
          setQuizzes([...quizzes, ...res.result.quizzes]);
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
        {quizzes === null ? (
          <div className={styles.loading}>
            <LoadingSpinner />
            <div className={styles.loadingText}>
              AI가 퀴즈를 만들고 있어요
              <br />
              잠시만 기다려주세요!
            </div>
          </div>
        ) : (
          <div className={styles.quizContainer}>
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className={styles.masonryGrid}
              columnClassName={styles.masonryColumn}
            >
              {quizzes.map((quiz, index) => (
                <div
                  key={index}
                  className={`${styles.quizCard} ${
                    selectedQuizzes.includes(quiz) ? styles.selected : ""
                  }`}
                  onClick={() => toggleQuizSelection(index)}
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
                          toggleQuizSelection(index);
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
            onClick={onCustomize}
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
