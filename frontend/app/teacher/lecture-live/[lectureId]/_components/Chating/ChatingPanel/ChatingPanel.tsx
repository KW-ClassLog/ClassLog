"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ChatingPanel.module.scss";
import IconButton from "@/components/Button/IconButton/IconButton";
import { X, SendHorizontal } from "lucide-react";
import { useLive } from "../../LectureLiveProvider";
import ChatBox from "@/components/ChatBox/ChatBox";
import BasicInput from "@/components/Input/BasicInput/BasicInput";

type Msg = {
  id: string;
  text: string;
  role: "teacher" | "student";
  ts?: number;
};

export default function ChatPanel() {
  const { togglePanel } = useLive();

  const [msgs, setMsgs] = useState<Msg[]>([
    { id: "seed1", text: "질문이요~", role: "student", ts: Date.now()},
  ]);
  const [text, setText] = useState("");

  const bodyRef = useRef<HTMLDivElement>(null);

  const closeChat = () => togglePanel("chat");

  const send = () => {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [
      ...m,
      { id: String(Date.now()), text: t, role: "teacher", ts: Date.now() },
    ]);
    setText("");
  };

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    send();
  };

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [msgs]);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const fmt = (ts: number) => {
    const d = new Date(ts);
    const yy = pad(d.getFullYear() % 100);
    const MM = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    const ss = pad(d.getSeconds());
    return `${yy}.${MM}.${dd} ${hh}:${mm}:${ss}`;
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
        {msgs.map((m) => {
          const tsText = m.ts ? fmt(m.ts) : "";
          return (
            <div
              key={m.id}
              className={`${styles.row} ${
                m.role === "teacher" ? styles.teacher : styles.student
              }`}
            >
              <ChatBox
                isAnonymous={true}
                nickname=""
                profilePicture=""
                message={m.text}
                timestamp={tsText}
                variant={m.role === "teacher" ? "teacher" : "student"}
              />
            </div>
          );
        })}
      </div>

      <form className={styles.inputRow} onSubmit={onSubmit}>
        <BasicInput
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="답변 입력하기"
          iconRight={
            <IconButton
              ariaLabel="전송"
              onClick={send}
              icon={<SendHorizontal size={18} color="#9AA4B2" />}
            />
          }
        />
      </form>
    </div>
  );
}