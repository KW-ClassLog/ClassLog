"use client";
import React from "react";
import { createPortal } from "react-dom";
import styles from "./ConfirmModal.module.scss";
import FullWidthButton from "@/components/Button/FullWidthButton/FullWidthButton";

type ConfirmModalProps = {
  onConfirm: () => void; // 확인 버튼을 클릭했을 때 실행할 함수
  onClose: () => void; // 모달을 닫을 함수 (취소 버튼 클릭 시)
  disableActions?: boolean; // 확인, 취소 버튼 비활성화
  children: React.ReactNode; // children을 받아올 수 있게 설정
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  children,
  onClose,
  disableActions,
  onConfirm,
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
        <div className="mixed-layout-1">
          <FullWidthButton onClick={onClose} disabled={disableActions}>취소</FullWidthButton>
          <FullWidthButton onClick={onConfirm} disabled={disableActions}>확인</FullWidthButton>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;
