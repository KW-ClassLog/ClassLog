"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import styles from "./chattingPanel.module.scss";
import IconButton from "@/components/Button/IconButton/IconButton";
import { X, SendHorizontal } from "lucide-react";
import { useLive } from "../../LectureLiveProvider";
import ChatBox from "@/components/ChatBox/ChatBox";
import BasicInput from "@/components/Input/BasicInput/BasicInput";
import { useParams } from "next/navigation";
import { useLectureChat, type ChatMessage } from "@/hooks/useLectureChat";
import { fetchChattingList } from "@/api/lectures/fetchChattingList";

export default function ChattingPanel() {
  const { togglePanel } = useLive();
  const { lectureId } = useParams<{ lectureId: string }>();

  // 소켓 연결
  const { messages, connected, sendMessage } = useLectureChat(lectureId);

  const [text, setText] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);

  const [previousMessages, setPreviousMessages] = useState<ChatMessage[]>([]);
  const fetchedOnceRef = useRef(false);

  const closeChat = () => togglePanel("chat");

  // 메시지 전송
  const send = () => {
    const t = text.trim();
    if (!t) return;
    sendMessage(t);
    setText("");
  };

  // Enter로 전송
  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    send();
  };

  // 연결 직후 과거 대화 불러오기
  useEffect(() => {
    if (!lectureId || !connected || fetchedOnceRef.current) return;

    let isMounted = true;
    (async () => {
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
      } catch (e) {
        setPreviousMessages([]);
        console.error("과거 채팅 불러오기 실패:", e);
      } finally {
        fetchedOnceRef.current = true;
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [lectureId, connected]);

  // 과거 + 실시간 합친 배열
  const combinedMessages = useMemo(
    () => [...previousMessages, ...messages],
    [previousMessages, messages]
  );

  // 새로운 메시지 오면 스크롤 맨 아래로 이동
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [combinedMessages]);

  const fmt = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleString("ko-KR", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>Question</span>
        <div className={styles.closeBtn}>
          <IconButton ariaLabel="채팅 닫기" onClick={closeChat} icon={<X />} />
        </div>
      </div>

      <div ref={bodyRef} className={styles.body}>
        {combinedMessages.map((m, i) => (
          <div
            key={i}
            className={`${styles.row} ${
              m.role === "TEACHER" ? styles.teacher : styles.student
            }`}
          >
            <ChatBox
              isAnonymous={true}
              nickname={m.senderName ?? ""}
              profilePicture=""
              message={m.content}
              timestamp={fmt(m.timestamp)}
              variant={m.role === "TEACHER" ? "teacher" : "student"}
            />
          </div>
        ))}
      </div>

      <form className={styles.inputRow} onSubmit={onSubmit}>
        <BasicInput
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={connected ? "답변 입력하기" : "연결 중..."}
          disabled={!connected}
          iconRight={
            <IconButton
              ariaLabel="전송"
              onClick={send}
              icon={<SendHorizontal size={18} color="#9AA4B2" />}
              disabled={!connected}
            />
          }
        />
      </form>
    </div>
  );
}