"use client";

import { Client, IMessage, StompSubscription, IFrame } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";

export type ChatMessage = {
  senderId: string | null;   // 보낸 사람 ID
  senderName: string | null; // 보낸 사람 닉네임
  content: string;           // 메시지 내용
  role: string;              // "TEACHER" | "STUDENT"
  timestamp: string;         // 시간
};

export function useLectureChat(lectureId: string | undefined) {
  
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!lectureId) return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL!;

    // STOMP 클라이언트 생성
    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      // 소켓 연결 성공 시 실행
      onConnect: () => {
        console.log("✅ Connected!");
        setConnected(true);

        // lectureId 채팅방 구독
        const destination = `/sub/lecture/${lectureId}`;
        console.log(`구독 요청: ${destination}`);

        const subscription = client.subscribe(destination, (message: IMessage) => {
          try {
            const parsed: ChatMessage = JSON.parse(message.body);
            setMessages((prev) => [...prev, parsed]);
            
            if (typeof window !== "undefined") {
              if (parsed.role !== "TEACHER") {
              window.dispatchEvent(new CustomEvent("live:chat:new", { detail: parsed }));
              }
            }
          } catch (e) {
            console.error("❌ 메시지 파싱 실패:", e);
          }
        });

        subscriptionRef.current = subscription;
      },

      // 연결 해제
      onDisconnect: () => {
        console.log("❌ Disconnected");
        setConnected(false);
      },

      // STOMP 프로토콜 에러
      onStompError: (frame: IFrame) => {
        console.error("STOMP Error:", frame);
      },

      // WebSocket 에러
      onWebSocketError: (event: Event) => {
        console.error("WS Error:", event);
      },
    });

    // 소켓 연결
    client.activate();
    clientRef.current = client;

    // 언마운트 시 구독 해제 및 연결 종료
    return () => {
      subscriptionRef.current?.unsubscribe();
      client.deactivate();
    };
  }, [lectureId]);

  // 메시지 전송
  const sendMessage = (content: string) => {
    if (!clientRef.current || !clientRef.current.connected) return;
    clientRef.current.publish({
      destination: `/pub/lecture/${lectureId}`,
      body: JSON.stringify({ content }),
    });
  };

  return { messages, connected, sendMessage };
}