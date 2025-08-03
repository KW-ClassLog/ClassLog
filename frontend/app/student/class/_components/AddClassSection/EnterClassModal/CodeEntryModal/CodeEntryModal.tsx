import ClosableModal from "@/components/Modal/ClosableModal/ClosableModal";
import React, { useState } from "react";
import styles from "./CodeEntryModal.module.scss";
import BasicInput from "@/components/Input/BasicInput/BasicInput";
import FullWidthButton from "@/components/Button/FullWidthButton/FullWidthButton";
import { inputEntryCode } from "@/api/classes/inputEntryCode";
import AlertModal from "@/components/Modal/AlertModal/AlertModal";

type CodeEntryModalProps = {
  onClose: () => void;
};

export default function CodeEntryModal({ onClose }: CodeEntryModalProps) {
  const [entryCode, setEntryCode] = useState("");
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const handleSubmit = async () => {
    const response = await inputEntryCode({ entryCode });
    if (response.isSuccess) {
      onClose();
    } else {
      setIsAlertModalOpen(true);
    }
  };

  return (
    <ClosableModal onClose={onClose}>
      <div className={styles.container}>
        <h2 className={styles.title}>클래스 입장코드를 입력하세요.</h2>

        <div className={styles.inputContainer}>
          <BasicInput
            placeholder="입장코드"
            value={entryCode}
            onChange={(e) => setEntryCode(e.target.value)}
          />
        </div>

        <div className={styles.buttonContainer}>
          <FullWidthButton onClick={handleSubmit} disabled={!entryCode.trim()}>
            확인
          </FullWidthButton>
        </div>
      </div>
      {isAlertModalOpen && (
        <AlertModal onClose={() => setIsAlertModalOpen(false)}>
          <p>입장코드가 일치하지 않습니다.</p>
        </AlertModal>
      )}
    </ClosableModal>
  );
}
