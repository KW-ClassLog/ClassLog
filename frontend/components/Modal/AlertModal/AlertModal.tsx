"use client";
import React from "react";
import { createPortal } from "react-dom";
import styles from "./AlertModal.module.scss";
import FullWidthButton from "@/components/Button/FullWidthButton/FullWidthButton";

type AlertModalProps = {
  onClose: () => void; // 모달을 닫을 함수
  children: React.ReactNode; // children을 받아올 수 있게 설정
  hideButton?: boolean; // 확인 버튼 숨김 여부
};

const AlertModal: React.FC<AlertModalProps> = ({
  children,
  onClose,
  hideButton,
}) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    // 클릭된 곳이 modal 내부가 아닌 경우에만 onClose 실행
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.message}>{children}</div>
        {!hideButton && (
          <FullWidthButton onClick={onClose}>확인</FullWidthButton>
        )}
      </div>
    </div>,
    document.body
  );
};

export default AlertModal;
