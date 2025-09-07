import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLectureStatusStore } from "@/store/useLectureStatusStore";
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
  const [questions, setQuestions] = useState<string[]>([]);
  const [questionInput, setQuestionInput] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<WebSocket | null>(null);

  // 소켓 연결 함수
  const connectSocket = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    try {
      // TODO: 실제 소켓 서버 URL로 변경
      const socketUrl = `ws://localhost:8080/ws/lecture/${lectureId}`;
      socketRef.current = new WebSocket(socketUrl);

      socketRef.current.onopen = () => {
        console.log("소켓 연결 성공");
      };

      socketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleSocketMessage(data);
        } catch (error) {
          console.error("소켓 메시지 파싱 오류:", error);
        }
      };

      socketRef.current.onclose = () => {
        console.log("소켓 연결 종료");
      };

      socketRef.current.onerror = (error) => {
        console.error("소켓 오류:", error);
      };
    } catch (error) {
      console.error("소켓 연결 실패:", error);
    }
  }, [lectureId]);

  // 소켓 메시지 처리 함수
  const handleSocketMessage = (data: {
    type: string;
    question?: string;
    questions?: string[];
  }) => {
    switch (data.type) {
      case "newQuestion":
        setQuestions((prev) => [...prev, data.question || ""]);
        break;
      case "questionList":
        setQuestions(data.questions || []);
        break;
      default:
        console.log("알 수 없는 메시지 타입:", data.type);
    }
  };

  // 질문 전송 함수
  const sendQuestion = () => {
    if (!questionInput.trim() || !socketRef.current) return;

    const message = {
      type: "sendQuestion",
      lectureId: lectureId,
      question: questionInput.trim(),
      timestamp: new Date().toISOString(),
    };

    socketRef.current.send(JSON.stringify(message));
    setQuestionInput(""); // 입력창 초기화
  };

  useEffect(() => {
    // TODO: API 호출로 변경
    setQuestions([
      "dd",
      "AsdfasAsdfasAsdfasAsdfasAsdfasAsdfasAsdfasAsdfasAsdfasAsdfasAsdfasAsdfasAsdfasAsdfasAsdfasAsdfasAsdfasAsdfasAsdfas",
      "Asdfadfg",
      "Asdfadfg",
    ]);
    setLoading(false);

    // 강의 중일 때만 소켓 연결
    if (lectureStatus === "onLecture") {
      connectSocket();
    }

    // 컴포넌트 언마운트 시 소켓 연결 해제
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [lectureId, lectureStatus, connectSocket]);

  const now = () => {
    try {
      const date = new Date();
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
            {questions.map((q, index) => (
              <li key={index} className={styles.questionItem}>
                <div className={styles.message}>{q}</div>
                <div className={styles.timestamp}>{now()}</div>
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
