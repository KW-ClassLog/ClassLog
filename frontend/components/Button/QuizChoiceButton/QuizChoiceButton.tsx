"use client";

import React from "react";
import styles from "./QuizChoiceButton.module.scss";

type QuizModeProps = {
  mode: "quiz";
  label: string;
  selected: boolean;
  onSelect: (label: string) => void;
};

type ResultModeProps = {
  mode: "result";
  label: string;
  userAnswer: string; // 사용자 답변
  correctAnswer: string; // 정답
  count: number; // 선택한 사람 수
};

type QuizChoiceButtonProps = QuizModeProps | ResultModeProps;

const QuizChoiceButton: React.FC<QuizChoiceButtonProps> = (props) => {
  const isQuizMode = (props: QuizChoiceButtonProps): props is QuizModeProps => {
    return props.mode === "quiz";
  };

  const isResultMode = (
    props: QuizChoiceButtonProps
  ): props is ResultModeProps => {
    return props.mode === "result";
  };

  // 버튼 클릭 핸들러
  const handleClick = () => {
    if (isQuizMode(props) && props.onSelect) {
      props.onSelect(props.label);
    }
  };

  // 스타일 동적 처리
  const getInputStyles = () => {
    if (isResultMode(props)) {
      if (
        props.userAnswer === props.correctAnswer &&
        props.label === props.userAnswer
      ) {
        return styles.correct; // 정답일 때
      } else if (
        props.userAnswer !== props.correctAnswer &&
        props.label === props.correctAnswer
      ) {
        return styles.correct; // 오답일 때
      } else if (
        props.userAnswer !== props.correctAnswer &&
        props.label === props.userAnswer
      ) {
        return styles.incorrect; // 오답일 때
      } else {
        return ""; // 나머지 경우
      }
    }
    return "";
  };

  // 클래스 이름 동적 처리
  const buttonClassNames = [
    styles.button,
    isQuizMode(props) && props.selected ? styles.selected : "",
    getInputStyles(),
  ].join(" ");

  // 비활성화 여부
  const isDisabled = isResultMode(props);

  return (
    <button
      className={buttonClassNames}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {props.label}
      {isResultMode(props) && props.count !== undefined && (
        <span className={styles.count}>({props.count}명)</span>
      )}
    </button>
  );
};

export default QuizChoiceButton;
