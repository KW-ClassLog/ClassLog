"use client";
import React from "react";
import styles from "./ClosableModal.module.scss";
import { X } from "lucide-react";

type ClosableModalProps = {
  onClose: () => void; // 모달을 닫을 함수
  children: React.ReactNode; // children을 받아올 수 있게 설정
};

const ClosableModal: React.FC<ClosableModalProps> = ({ children, onClose }) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    // 클릭된 곳이 modal 내부가 아닌 경우에만 onClose 실행
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.closeButton}>
          <X onClick={onClose} size={24} className={styles.button} />
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default ClosableModal;
