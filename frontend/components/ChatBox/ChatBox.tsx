"use client";
import React from "react";
import Image from "next/image";
import styles from "./ChatBox.module.scss";

type ChatBoxProps = {
  isAnonymous: boolean; // 익명 모드 여부
  nickname: string; // 닉네임
  profilePicture: string; // 프로필 사진
  message: string; // 채팅 내용
  timestamp: string; // 날짜
};

const ChatBox: React.FC<ChatBoxProps> = ({
  isAnonymous,
  nickname,
  profilePicture,
  message,
  timestamp,
}) => {
  return (
    <div className={styles.chatBox}>
      <div className={styles.messageContainer}>
        {!isAnonymous && (
          <Image
            src={profilePicture}
            alt="Profile"
            className={styles.profilePicture}
            width={40}
            height={40}
          />
        )}

        <div className={styles.textContainer}>
          <div className={styles.header}>
            {!isAnonymous ? (
              <span className={styles.nickname}>{nickname}</span>
            ) : (
              <span className={styles.nickname}>
                익명{Math.floor(Math.random() * 100)}
              </span>
            )}
            <span className={styles.timestamp}>{timestamp}</span>
          </div>
          <div className={styles.message}>{message}</div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
