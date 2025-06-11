"use client";

import { useState } from "react";
import styles from "./MakeQuizModal.module.scss";
import ClosableModal from "../ClosableModal/ClosableModal";
import QuizPreview from "./QuizPreview/QuizPreview";
import { saveQuiz } from "@/api/quizzes/saveQuiz";
import AlertModal from "@/components/Modal/AlertModal/AlertModal";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { Quiz } from "@/types/quizzes/createQuizTypes";
import CustomizeQuizModal from "./CustomizeQuizModal/CustomizeQuizModal";
import { useQuizStore } from "@/store/useQuizStore";

interface MakeQuizModalProps {
  onClose: () => void;
  lectureId: string;
}

const MakeQuizModal = ({ onClose, lectureId }: MakeQuizModalProps) => {
  const [useAudio, setUseAudio] = useState(false);
  const [customizingQuizzes, setCustomizingQuizzes] = useState<Quiz[] | null>(
    null
  );

  // 퀴즈 스토어 사용
  const {
    resetLectureQuizzes,
    isSaving,
    saveSuccess,
    saveError,
    setIsSaving,
    setSaveSuccess,
    setSaveError,
  } = useQuizStore();

  const handleCustomize = (selectedQuizzes: Quiz[]) => {
    setCustomizingQuizzes(selectedQuizzes);
  };

  const handleSubmit = async (quizzes: Quiz[]) => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    try {
      const res = await saveQuiz(lectureId, quizzes);
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

  const handleClose = () => {
    // 모달이 닫힐 때 해당 lectureId의 퀴즈 리셋
    resetLectureQuizzes(lectureId);
    onClose();
  };

  return (
    <>
      {customizingQuizzes ? (
        <CustomizeQuizModal
          quizzes={customizingQuizzes}
          lectureId={lectureId}
          onClose={() => setCustomizingQuizzes(null)}
        />
      ) : (
        <ClosableModal onClose={handleClose}>
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
                <div
                  className={`${styles.switchBackground} ${styles.active}`}
                />
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
            />
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
              <AlertModal onClose={() => setSaveError(null)}>
                {saveError}
              </AlertModal>
            )}
          </div>
        </ClosableModal>
      )}
    </>
  );
};

export default MakeQuizModal;
