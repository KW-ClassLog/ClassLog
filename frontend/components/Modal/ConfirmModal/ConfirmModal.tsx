"use client";
import React from "react";
import styles from "./ConfirmModal.module.scss";
import FullWidthButton from "@/components/Button/FullWidthButton/FullWidthButton";

type ConfirmModalProps = {
  onConfirm: () => void; // 확인 버튼을 클릭했을 때 실행할 함수
  onClose: () => void; // 모달을 닫을 함수 (취소 버튼 클릭 시)
  children: React.ReactNode; // children을 받아올 수 있게 설정
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  children,
  onClose,
  onConfirm,
}) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    // 클릭된 곳이 modal 내부가 아닌 경우에만 onClose 실행
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.message}>{children}</div>
        <div className="mixed-layout-1">
          <FullWidthButton onClick={onClose}>취소</FullWidthButton>
          <FullWidthButton onClick={onConfirm}>확인</FullWidthButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
