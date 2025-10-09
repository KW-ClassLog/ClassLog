"use client";

import { useEffect, useState } from "react";
import IconButton from "@/components/Button/IconButton/IconButton";
import { MessageCircleMore } from "lucide-react";
import { useLive } from "../../LectureLiveProvider";
import styles from "./ChattingButton.module.scss";

export default function ChattingButton({
  className,
  onPress,
}: {
  className?: string;
  onPress?: () => void;
}) {
  const { panels, togglePanel } = useLive();
  const isOpen = panels.chat;
  const [unread, setUnread] = useState(false);

  useEffect(() => {
    if (isOpen) setUnread(false);
  }, [isOpen]);

  useEffect(() => {
    const onNew = () => {
      if (!isOpen) setUnread(true);
    };
    window.addEventListener("live:chat:new", onNew as EventListener);
    return () => window.removeEventListener("live:chat:new", onNew as EventListener);
  }, [isOpen]);

  const onClick = () => {
    onPress?.();
    togglePanel("chat");
  };

  return (
    <span className={`${styles.wrap} ${className ?? ""}`}>
      <IconButton
        ariaLabel="채팅"
        onClick={onClick}
        icon={<MessageCircleMore data-active={isOpen} />}
      />
      {unread && !isOpen && <i className={styles.badge} aria-hidden />}
    </span>
  );
}