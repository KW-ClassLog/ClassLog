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
  const [useAudio, setUseAudio] = useState(false);

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
        {
          quizBody: "오늘 내가 먹고싶은 과일은?",
          solution: "바나나",
          choices: [],
          type: "단답형",
        },
      ]);
    }, 2000);
  }, []);

  const handleCustomize = () => {
    // TODO: Implement customization logic
  };

  const handleSubmit = () => {
    // TODO: Implement submit logic
  };

  return (
    <ClosableModal onClose={onClose}>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>
          퀴즈에 활용할 자료를 선택하고, 아래에서 자동으로 생성된 퀴즈를
          확인해보세요!
        </h2>
        <div className={styles.toggleSection}>
          <div className={styles.toggleSwitch}>
            <span className={`${styles.switchLabel} ${styles.active}`}>
              강의자료
            </span>
            <div className={`${styles.switchBackground} ${styles.active}`} />
          </div>
          <div
            className={styles.toggleSwitch}
            onClick={() => setUseAudio((prev) => !prev)}
            style={{ cursor: "pointer" }}
          >
            <input
              type="checkbox"
              checked={useAudio}
              onChange={() => {}}
              style={{ display: "none" }}
            />
            <span
              className={`${styles.switchLabel} ${
                useAudio ? styles.active : ""
              }`}
            >
              녹음본
            </span>
            <div
              className={`${styles.switchBackground} ${
                useAudio ? styles.active : ""
              }`}
            />
          </div>
        </div>
        <QuizPreview
          quizzes={quizzes}
          onCustomize={handleCustomize}
          onSubmit={handleSubmit}
        />
      </div>
    </ClosableModal>
  );
};

export default MakeQuizModal;
