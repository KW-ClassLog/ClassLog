"use client";
import React, { useState } from "react";
import styles from "./SelectableButton.module.scss"; // 스타일 파일

interface SelectableButtonProps {
  selected: boolean; // 선택 상태
  onClick?: (e?: React.MouseEvent) => void; // 클릭 이벤트 핸들러
  disabled?: boolean; // 비활성화 여부
}

const SelectableButton: React.FC<SelectableButtonProps> = ({
  selected,
  onClick,
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = useState(false); // hover 상태 추가

  const handleMouseEnter = () => {
    if (!disabled) {
      setIsHovered(true); // hover 시작
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false); // hover 종료
  };

  return (
    <button
      className={`${styles.button} ${selected ? styles.selected : ""} ${
        disabled ? styles.disabled : ""
      }`}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={handleMouseEnter} // hover 시작 시 처리
      onMouseLeave={handleMouseLeave} // hover 종료 시 처리
    >
      {selected && isHovered ? "선택취소" : selected ? "선택됨" : "선택"}{" "}
      {/* hover 상태에서 "선택취소"로 변경 */}
    </button>
  );
};

export default SelectableButton;
