"use client";
import React from "react";
import styles from "./FullWidthButton.module.scss";

interface FullWidthButtonProps {
  children: React.ReactNode; // 버튼에 들어갈 텍스트/요소
  onClick: () => void; // 클릭 이벤트 핸들러
  disabled?: boolean; // 버튼 비활성화 여부 (선택사항)
  type?: "button" | "submit"; // HTML 버튼 타입 (선택사항)
}

const FullWidthButton: React.FC<FullWidthButtonProps> = ({
  children,
  onClick,
  disabled = false,
  type = "button", // 기본 버튼 타입은 "button"
}) => {
  return (
    <button
      className={`${styles.button} ${disabled ? styles.disabled : ""}`}
      onClick={onClick}
      disabled={disabled}
      type={type} // 버튼 타입 설정
    >
      {children}
    </button>
  );
};

export default FullWidthButton;
