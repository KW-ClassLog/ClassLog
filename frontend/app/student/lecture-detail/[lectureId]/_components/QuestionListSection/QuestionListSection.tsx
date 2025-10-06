import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLectureStatusStore } from "@/store/useLectureStatusStore";
import { ChatMessage, useLectureChat } from "@/hooks/useLectureChat";
import NoDataView from "@/components/NoDataView/NoDataView";
import { MessageCircle, Send } from "lucide-react";
import styles from "./QuestionListSection.module.scss";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import BasicInput from "@/components/Input/BasicInput/BasicInput";
import IconButton from "@/components/Button/IconButton/IconButton";
import { fetchChattingList } from "@/api/lectures/fetchChattingList";

export default function QuestionListSection({
  lectureId,
}: {
  lectureId: string;
}) {
  const { lectureStatus } = useLectureStatusStore();
  const { messages, connected, sendMessage } = useLectureChat(lectureId);
  const [questionInput, setQuestionInput] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [previousMessages, setPreviousMessages] = useState<ChatMessage[]>([]);
  const listEndRef = useRef<HTMLLIElement | null>(null);

  // 질문 전송 함수
  const sendQuestion = () => {
    if (!questionInput.trim() || !connected) return;

    sendMessage(questionInput.trim());
    setQuestionInput(""); // 입력창 초기화
  };

  useEffect(() => {
    let isMounted = true;
    const loadPreviousMessages = async () => {
      try {
        const res = await fetchChattingList(lectureId);
        if (!isMounted) return;
        if (res.isSuccess && Array.isArray(res.result)) {
          const mapped: ChatMessage[] = res.result.map((m) => ({
            senderId: null,
            senderName: null,
            content: m.content,
            role: m.role,
            timestamp: m.timestamp,
          }));
          setPreviousMessages(mapped);
        } else {
          setPreviousMessages([]);
        }
      } catch {
        if (!isMounted) return;
        setPreviousMessages([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadPreviousMessages();
    return () => {
      isMounted = false;
    };
  }, [lectureId]);

  const combinedMessages = useMemo(() => {
    // 과거 메시지 이후에 실시간 메시지 순서로 노출
    return [...previousMessages, ...messages];
  }, [previousMessages, messages]);

  // 새로운 메시지가 추가될 때 항상 맨 아래로 스크롤
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [combinedMessages]);

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
            {combinedMessages.map((message, index) => (
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
            <li ref={listEndRef} className={styles.bottomSpacer} />
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
