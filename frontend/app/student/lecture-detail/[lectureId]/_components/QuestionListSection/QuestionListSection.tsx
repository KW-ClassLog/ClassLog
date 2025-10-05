import React, { useEffect, useState } from "react";
import { useLectureStatusStore } from "@/store/useLectureStatusStore";
import { useLectureChat } from "@/hooks/useLectureChat";
import NoDataView from "@/components/NoDataView/NoDataView";
import { MessageCircle, Send } from "lucide-react";
import styles from "./QuestionListSection.module.scss";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import BasicInput from "@/components/Input/BasicInput/BasicInput";
import IconButton from "@/components/Button/IconButton/IconButton";

export default function QuestionListSection({
  lectureId,
}: {
  lectureId: string;
}) {
  const { lectureStatus } = useLectureStatusStore();
  const { messages, connected, sendMessage } = useLectureChat(lectureId);
  const [questionInput, setQuestionInput] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // 질문 전송 함수
  const sendQuestion = () => {
    if (!questionInput.trim() || !connected) return;

    sendMessage(questionInput.trim());
    setQuestionInput(""); // 입력창 초기화
  };

  useEffect(() => {
    // TODO: API 호출로 변경 - 기존 질문 목록 불러오기
    setLoading(false);
  }, [lectureId]);

  // 시간 포맷팅 함수
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    } catch {
      return "00:00";
    }
  };

  if (loading) return <LoadingSpinner text="질문 목록을 불러오는 중..." />;

  return (
    <div className={styles.questionListSection}>
      {lectureStatus === "onLecture" ? (
        <div className={styles.questionListContainer}>
          <ul className={styles.questionList}>
            {messages.map((message, index) => (
              <li key={index} className={styles.questionItem}>
                <div className={styles.message}>
                  <div className={styles.content}>{message.content}</div>
                </div>
                <div className={styles.timestamp}>
                  {formatTime(message.timestamp)}
                </div>
                {message.role === "TEACHER" && (
                  <div className={styles.teacherName}>
                    * 강사가 보낸 메시지입니다.
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className={styles.questionInputContainer}>
            <BasicInput
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              placeholder="질문을 입력해주세요."
            />
            <IconButton
              icon={<Send />}
              onClick={sendQuestion}
              ariaLabel={"전송"}
              disabled={!connected}
            />
          </div>
        </div>
      ) : (
        <NoDataView
          icon={MessageCircle}
          title={"수업 중에만 질문이 가능합니다."}
          description={""}
        />
      )}
    </div>
  );
}
