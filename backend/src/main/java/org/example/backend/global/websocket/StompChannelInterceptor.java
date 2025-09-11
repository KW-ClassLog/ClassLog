package org.example.backend.global.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.global.security.token.JWTUtil;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class StompChannelInterceptor implements ChannelInterceptor {

    private final JWTUtil jwtUtil;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        log.info("CONNECT 헤더: {}", accessor.toNativeHeaderMap());

        if(accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            log.info("WebSocket CONNECT 요청 도착");

            String token = accessor.getFirstNativeHeader("Authorization");

            if(token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
                UUID userId = jwtUtil.getUserId(token);
                String role = jwtUtil.getRole(token);

                log.info("✅ STOMP 연결 토큰 검증 성공: userId={}, role={}", userId, role);
                accessor.setUser(new StompPrincipal(userId, role));
            }else {
                log.warn("❌ STOMP 연결 시 토큰 누락 또는 형식 오류: {}", token);
            }
        }
        return message;
    }

}
