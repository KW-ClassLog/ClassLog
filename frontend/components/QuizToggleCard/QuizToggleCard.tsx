"use client";
import React, { useState } from "react";
import styles from "./QuizToggleCard.module.scss";
import QuizChoiceButton from "../Button/QuizChoiceButton/QuizChoiceButton";
import QuizInput from "../Input/QuizInput/QuizInput";
import { CircleCheck, ChevronDown } from "lucide-react";

type QuizModeProps = {
  quizId: string;
  quizIndex: number;
  mode: "quiz";
  type: "multipleChoice" | "shortAnswer" | "trueFalse";
  question: string;
  labels?: string[]; // multipleChoice 타입일때만 필요
  onSelect?: (label: string) => void;
  onInputChange?: (inputAnswer: string) => void; // 단답형 문제에서 입력 변경을 처리하는 함수
};

type ResultModeProps = {
  quizId: string;
  quizIndex: number;
  mode: "result";
  type: "multipleChoice" | "shortAnswer" | "trueFalse";
  question: string;
  labels?: string[]; // multipleChoice 타입일때만 필요
  userAnswer: string; // 사용자 답변
  correctAnswer: string; // 정답
  counts: { [key: string]: number }; // 각 라벨에 대한 선택자 수
};

type TeacherModeProps = {
  quizId: string;
  quizIndex: number;
  mode: "teacher";
  type: "multipleChoice" | "shortAnswer" | "trueFalse";
  question: string;
  labels?: string[]; // multipleChoice 타입일때만 필요
  correctAnswer: string; // 정답
  counts: { [key: string]: number }; // 각 라벨에 대한 선택자 수
};

type QuizToggleCardProps = QuizModeProps | ResultModeProps | TeacherModeProps;

const QuizToggleCard: React.FC<QuizToggleCardProps> = (props) => {
  // 선택한 답을 처리하는 상태
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [inputAnswer, setInputAnswer] = useState<string>(""); // QuizInput에서 입력된 답을 추적
  const [isCardOpen, setIsCardOpen] = useState(false);

  const handleSelect = (label: string) => {
    setSelectedAnswer(label);
    if (props.mode === "quiz" && props.onSelect) {
      props.onSelect(label);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputAnswer(e.target.value);
    if (props.mode === "quiz" && props.onInputChange) {
      props.onInputChange(e.target.value); // 입력된 값을 부모로 전달
    }
  };

  const handleCardToggleClick = () => {
    setIsCardOpen((prev) => !prev);
  };

  // OX 문제는 labels를 ["O", "X"]로 자동 설정
  const getLabels = () => {
    if (props.type === "trueFalse" && !props.labels) {
      return ["O", "X"];
    }
    return props.labels;
  };

  // 모드별로 렌더링하는 함수
  const renderContent = () => {
    if (props.mode === "quiz") {
      return (
        <div className="mixed-layout-3">
          {props.type === "multipleChoice" || props.type === "trueFalse" ? (
            getLabels()?.map((label) => (
              <QuizChoiceButton
                key={label}
                label={label}
                selected={selectedAnswer === label}
                onSelect={handleSelect}
                mode="quiz"
              />
            ))
          ) : (
            <QuizInput
              mode="quiz"
              value={inputAnswer}
              onChange={handleInputChange}
            />
          )}
        </div>
      );
    }

    if (props.mode === "result") {
      return (
        <div className="mixed-layout-3">
          {props.type === "multipleChoice" || props.type === "trueFalse" ? (
            getLabels()?.map((label) => (
              <QuizChoiceButton
                key={label}
                label={label}
                userAnswer={props.userAnswer}
                correctAnswer={props.correctAnswer}
                count={props.counts[label]} // 해당 label에 대한 선택자 수
                mode="result"
              />
            ))
          ) : (
            <QuizInput
              mode="result"
              userAnswer={props.userAnswer}
              correctAnswer={props.correctAnswer}
              count={0} // 단답형에서 사용되지 않음
            />
          )}
        </div>
      );
    }

    if (props.mode === "teacher") {
      return (
        <div className="mixed-layout-3">
          {props.type === "multipleChoice" || props.type === "trueFalse" ? (
            getLabels()?.map((label) => (
              <QuizChoiceButton
                key={label}
                label={label}
                correctAnswer={props.correctAnswer}
                count={props.counts[label]} // 해당 label에 대한 선택자 수
                mode="teacher"
              />
            ))
          ) : (
            <QuizInput
              mode="teacher"
              correctAnswer={props.correctAnswer}
              count={0} // 단답형에서 사용되지 않음
            />
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className={styles.card}>
      <div className={styles.header} onClick={handleCardToggleClick}>
        <div className="mixed-layout-2">
          {(props.mode === "quiz" || props.mode === "result") && (
            <CircleCheck
              className={styles.checkIcon}
              size={24}
              color={selectedAnswer || inputAnswer ? "#4894FE" : "#ccc"}
              style={{
                transition: "color 0.3s ease", // 부드러운 색상 변화
              }}
            />
          )}
          <h1 className={styles.index}>퀴즈 {props.quizIndex}</h1>
          {(props.mode === "result" || props.mode === "teacher") && (
            <p className={styles.correctRate}>정답률: </p>
          )}
        </div>

        {(props.mode === "quiz" || props.mode === "result") && (
          <div
            className={`${styles.toggleButton} ${
              isCardOpen ? styles.open : ""
            }`}
          >
            <ChevronDown size={24} color="#909090" />
          </div>
        )}
      </div>
      <div className={`${styles.content} ${isCardOpen ? styles.open : ""}`}>
        <h2 className={styles.quizTitle}>{props.question}</h2>
        {renderContent()}
      </div>
    </div>
  );
};

export default QuizToggleCard;
