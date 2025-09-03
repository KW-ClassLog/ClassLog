package org.example.backend.domain.question.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.domain.question.dto.request.MessageRequestDTO;
import org.example.backend.domain.question.exception.QuestionErrorCode;
import org.example.backend.domain.question.exception.QuestionException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public void sendMessage(MessageRequestDTO.MessageDTO messageDTO) {
        /**
         * STOMP로부터 수신한 메시지를 Redis Pub/Sub으로 전파하고,
         * Redis List에 저장하는 메서드
         */

        try{
            UUID lectureId = messageDTO.getLectureId();
            String messageJson = objectMapper.writeValueAsString(messageDTO); // DTO -> JSON 직렬화

            // Redis 채널 이름 지정: lecture:{lectureId}
            String redisChannel = "lecture:"+ lectureId;
            // Redis List 키 이름 지정(채팅 내용 저장용): chat:lecture:{lectureId}
            String redisListKey = "chat:lecture:"+ lectureId;

            // Redis pub/sub - 메시지 전파
            redisTemplate.convertAndSend(redisChannel, messageJson);

            // Redis list - 메시지 저장
            redisTemplate.opsForList().rightPush(redisListKey, messageJson);

            // 추후 제거
            log.info("채팅 메시지 전송 성공 - lectureId={}, senderId={}, content={}",
                    lectureId, messageDTO.getSenderId(), messageDTO.getContent());

        } catch (Exception e){
            log.error("채팅 메시지 전송 실패",e);
            throw new QuestionException(QuestionErrorCode._CHAT_MESSAGE_SEND_FAIL);
        }
    }
}
