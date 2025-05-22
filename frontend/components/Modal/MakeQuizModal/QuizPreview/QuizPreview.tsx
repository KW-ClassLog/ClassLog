// _components/QuizPreview.tsx
import styles from "./QuizPreview.module.scss";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { useState } from "react";
import Masonry from "react-masonry-css";
import SelectableButton from "@/components/Button/SelectableButton/SelectableButton";
import AlertModal from "@/components/Modal/AlertModal/AlertModal";

interface Quiz {
  quizBody: string;
  solution: string;
  choices: string[];
  type: "객관식" | "단답형" | "OX";
}

interface QuizPreviewProps {
  quizzes: Quiz[] | null;
  onCustomize?: () => void;
  onSubmit?: () => void;
}

const QuizPreview = ({ quizzes, onCustomize, onSubmit }: QuizPreviewProps) => {
  const [selectedQuizzes, setSelectedQuizzes] = useState<number[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  const toggleQuizSelection = (index: number) => {
    setSelectedQuizzes((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        if (prev.length >= 4) {
          setShowAlert(true);
          return prev;
        }
        return [...prev, index];
      }
    });
  };

  const breakpointColumnsObj = {
    default: 2,
    800: 1,
  };

  const handleMoreQuiz = () => {
    console.log("moreQuiz");
  };

  return (
    <div className={styles.wrapper}>
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
                    selectedQuizzes.includes(index) ? styles.selected : ""
                  }`}
                  onClick={() => toggleQuizSelection(index)}
                >
                  <div className={styles.quizCardHeader}>
                    <div className={styles.type}>{quiz.type}</div>
                    <div className={styles.question}>{quiz.quizBody}</div>
                    <div className={styles.selectButtonWrapper}>
                      <SelectableButton
                        selected={selectedQuizzes.includes(index)}
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
                  {quiz.type === "객관식" && quiz.choices.length > 0 && (
                    <ul className={styles.choices}>
                      {quiz.choices.map((choice, index) => (
                        <li key={index}>
                          {index + 1}. {choice}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className={styles.answer}>정답: {quiz.solution}</div>
                </div>
              ))}
            </Masonry>
            <p className={styles.moreQuiz} onClick={handleMoreQuiz}>
              + 다른 퀴즈도 보고싶어요
            </p>
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
            onClick={onSubmit}
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
