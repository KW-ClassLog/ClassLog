// MakeQuizModal.tsx
import { useState } from "react";
import styles from "./MakeQuizModal.module.scss";
import ClosableModal from "../ClosableModal/ClosableModal";
import QuizPreview from "./QuizPreview/QuizPreview";

interface MakeQuizModalProps {
  onClose: () => void;
  lectureId: string;
}

const MakeQuizModal = ({ onClose, lectureId }: MakeQuizModalProps) => {
  const [useAudio, setUseAudio] = useState(false);

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
          lectureId={lectureId}
          useAudio={useAudio}
          onCustomize={handleCustomize}
          onSubmit={handleSubmit}
          onClose={onClose}
        />
      </div>
    </ClosableModal>
  );
};

export default MakeQuizModal;
