"use client";

import React from "react";
import styles from "./QuizChoiceButton.module.scss";

interface QuizChoiceButtonProps {
  label: string; // 버튼에 들어갈 텍스트
  selected?: boolean; // 선택 상태
  correct?: boolean; // 정답 여부
  incorrect?: boolean; // 오답 여부
  count?: number; // 선택한 사람 수
  onSelect?: (label: string) => void; // 선택 상태를 부모에게 전달하는 콜백 함수
}

const QuizChoiceButton: React.FC<QuizChoiceButtonProps> = ({
  label,
  selected,
  correct,
  incorrect,
  count,
  onSelect,
}) => {
  // 버튼 스타일 동적으로 적용
  const buttonClassNames = [
    styles.button,
    selected ? styles.selected : "",
    correct ? styles.correct : "",
    incorrect ? styles.incorrect : "",
  ].join(" ");

  // 비활성화 로직: 정답/오답이 있는 경우 비활성화
  const isDisabled =
    correct !== undefined || incorrect !== undefined || count !== undefined;

  const handleClick = () => {
    if (!isDisabled) {
      onSelect?.(label); // 버튼 클릭 시 선택된 정보를 부모에게 전달
    }
  };

  return (
    <button
      className={buttonClassNames}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {label}
      {count !== undefined && <span className={styles.count}>({count}명)</span>}
    </button>
  );
};

export default QuizChoiceButton;
