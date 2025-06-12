"use client";

import React from "react";
import styles from "./QuizInput.module.scss";

// 입력 모드에 맞는 prop 타입을 정의
type QuizModeProps = {
  mode: "quiz";
  value: string; // 사용자가 입력한 값
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // 입력값 변경 핸들러
};

type ResultModeProps = {
  mode: "result";
  userAnswer: string; // 사용자 답변
  correctAnswer: string; // 정답
  count: number; // 선택한 사람 수
};

type TeacherModeProps = {
  mode: "teacher";
  correctAnswer: string; // 정답
  count?: number; // 선택한 사람 수
};

type QuizInputProps = QuizModeProps | ResultModeProps | TeacherModeProps;

const QuizInput: React.FC<QuizInputProps> = (props) => {
  // props 타입 가드 함수
  const isQuizMode = (props: QuizInputProps): props is QuizModeProps => {
    return props.mode === "quiz";
  };

  const isResultMode = (props: QuizInputProps): props is ResultModeProps => {
    return props.mode === "result";
  };

  const isTeacherMode = (props: QuizInputProps): props is TeacherModeProps => {
    return props.mode === "teacher";
  };

  const getInputStyles = () => {
    if (isQuizMode(props)) {
      return props.value ? styles.blueBorder : styles.grayBorder;
    } else if (isResultMode(props)) {
      return props.userAnswer === props.correctAnswer
        ? styles.blueBorder
        : styles.redBorder;
    } else if (isTeacherMode(props)) {
      return styles.blueBorder;
    }
    return styles.grayBorder;
  };

  const renderInputValue = () => {
    if (isResultMode(props)) {
      if (props.userAnswer === props.correctAnswer) {
        return `${props.correctAnswer} (${props.count}명)`;
      } else {
        return props.userAnswer;
      }
    } else if (isTeacherMode(props)) {
      return `정답 : ${props.correctAnswer} (${props.count}명)`;
    } else if (isQuizMode(props)) {
      return props.value;
    }
    return "";
  };

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        value={renderInputValue()}
        onChange={isQuizMode(props) ? props.onChange : undefined}
        className={`${styles.input} ${getInputStyles()}`}
        placeholder="정답을 입력해주세요."
        disabled={!isQuizMode(props)}
        readOnly={!isQuizMode(props)}
      />
      {isResultMode(props) && props.userAnswer !== props.correctAnswer && (
        <div className={styles.answerInfo}>
          <p className={styles.correctAnswer}>정답: {props.correctAnswer}</p>
          <p className={styles.count}>({props.count}명)</p>
        </div>
      )}
    </div>
  );
};

export default QuizInput;
