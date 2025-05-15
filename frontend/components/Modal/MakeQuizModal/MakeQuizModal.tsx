// MakeQuizModal.tsx
import { useEffect, useState } from "react";
import styles from "./MakeQuizModal.module.scss";
import ClosableModal from "../ClosableModal/ClosableModal";
import QuizPreview from "./QuizPreview/QuizPreview";

interface Quiz {
  quizBody: string;
  solution: string;
  choices: string[];
  type: "객관식" | "단답형" | "OX";
}

interface MakeQuizModalProps {
  onClose: () => void;
  lectureId: string;
}

const MakeQuizModal = ({ onClose, lectureId }: MakeQuizModalProps) => {
  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);

  useEffect(() => {
    // TODO: Replace with actual data fetch using lectureId
    setTimeout(() => {
      setQuizzes([
        {
          quizBody: "오늘 내가 먹고싶은 과일은?",
          solution: "바나나",
          choices: ["바나나", "딸기", "참외", "수박"],
          type: "객관식",
        },
        {
          quizBody: "오늘 나는 과일이 먹고싶다",
          solution: "O",
          choices: [],
          type: "OX",
        },
        {
          quizBody: "오늘 내가 먹고싶은 과일은?",
          solution: "바나나",
          choices: [],
          type: "단답형",
        },
        {
          quizBody: "오늘 내가 먹고싶은 과일은?",
          solution: "바나나",
          choices: [],
          type: "단답형",
        },
        {
          quizBody: "오늘 내가 먹고싶은 과일은?",
          solution: "바나나",
          choices: [],
          type: "단답형",
        },
      ]);
    }, 2000);
  }, []);

  return (
    <ClosableModal onClose={onClose}>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>
          퀴즈에 활용할 자료를 선택하고, 아래에서 자동으로 생성된 퀴즈를
          확인해보세요!
        </h2>
        <div className={styles.toggleSection}>
          <span className={styles.toggle}>강의자료</span>
          <span className={styles.toggleDisabled}>녹음본</span>
        </div>
        <div className={styles.content}>
          {quizzes === null ? (
            <div className={styles.loading}>
              AI가 퀴즈를 만들고 있어요
              <br />
              잠시만 기다려주세요
            </div>
          ) : (
            quizzes.map((quiz, index) => (
              <QuizPreview key={index} quiz={quiz} />
            ))
          )}
        </div>
        <div className={styles.buttonSection}>
          <button className={styles.customizing}>
            선택한 퀴즈를 기반으로 커스터마이징 하기
          </button>
          <button className={styles.submit}>이대로 퀴즈 제출하기</button>
        </div>
      </div>
    </ClosableModal>
  );
};

export default MakeQuizModal;
