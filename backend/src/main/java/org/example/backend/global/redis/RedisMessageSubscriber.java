package org.example.backend.global.redis;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.domain.question.dto.request.MessageRequestDTO;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

/**
 * redis subscriber 역할을 수행하는 클래스
 * redis pub/sub 채널로 메시지를 수신하면, 해당 메시지를 STOMP를 통해 web socket 구독자에게 브로드캐스트
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RedisMessageSubscriber implements MessageListener {

    private final SimpMessageSendingOperations simpMessageSendingOperations;
    private final ObjectMapper objectMapper;

    /**
     * redis로부터 메시지를 수신했을 때 호출되는 메소드
     *
     * @param message redis에서 전달된 메시지(json 형태)
     * @param pattern 구독중인 채널 패턴
     */
    @Override
    public void onMessage(Message message, byte[] pattern) {
        try{
            String channel = new String(pattern);
            String body = new String(message.getBody());

            // JSON -> DTO 역직렬화
            MessageRequestDTO.MessageDTO chatMessage = objectMapper.readValue(body, MessageRequestDTO.MessageDTO.class);

            // subscriber에게 STOMP 메시지 전송
            simpMessageSendingOperations.convertAndSend("/sub/lecture/"+ chatMessage.getLectureId(), chatMessage);
        } catch (Exception e) {
            log.error("Redis 메시지 수신 실패", e);
        }
    }
}
