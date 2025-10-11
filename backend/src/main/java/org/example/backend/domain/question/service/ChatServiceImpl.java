package org.example.backend.domain.question.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.domain.question.dto.request.MessageRequestDTO;
import org.example.backend.domain.question.exception.QuestionErrorCode;
import org.example.backend.domain.question.exception.QuestionException;
import org.example.backend.domain.user.entity.User;
import org.example.backend.domain.user.exception.UserErrorCode;
import org.example.backend.domain.user.exception.UserException;
import org.example.backend.domain.user.repository.UserRepository;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;

    @Override
    public void sendMessage(UUID lectureId, MessageRequestDTO.MessageDTO messageDTO, UUID userId, String role) {
        /**
         * STOMP로부터 수신한 메시지를 Redis Pub/Sub으로 전파하고,
         * Redis List에 저장하는 메서드
         */

        try{
            // 사용자 정보 조회
            User sender = userRepository.findById(userId)
                    .orElseThrow(() -> new UserException(UserErrorCode._USER_NOT_FOUND));

            String senderName = sender.getName();

            // 1. 메시지 저장
            // 저장용 DTO 구성
            MessageRequestDTO.MessageDTO originalMessage = MessageRequestDTO.MessageDTO.builder()
                    .senderId(userId)
                    .senderName(senderName)
                    .content(messageDTO.getContent())
                    .role(sender.getRole())
                    .timestamp(LocalDateTime.now())
                    .build();

            String originalMessageJson = objectMapper.writeValueAsString(originalMessage); // DTO -> JSON 직렬화

            // Redis List 키 이름 지정(채팅 내용 저장용): chat:lecture:{lectureId}
            String redisListKey = "chat:lecture:"+ lectureId;

            // Redis list - 메시지 저장
            redisTemplate.opsForList().rightPush(redisListKey, originalMessageJson);


            // 2. 메시지 전파
            // 메시지 구성
            MessageRequestDTO.MessageDTO maskMessage = MessageRequestDTO.MessageDTO.builder()
                    .senderId(userId)
                    .senderName(null)
                    .content(messageDTO.getContent())
                    .role(sender.getRole())
                    .timestamp(LocalDateTime.now())
                    .build();

            String maskMessageJson = objectMapper.writeValueAsString(maskMessage); // DTO -> JSON 직렬화

            // Redis 채널 이름 지정: lecture:{lectureId}
            String studentChannel = "lecture:" + lectureId;
            // Redis pub/sub - 메시지 전파
            redisTemplate.convertAndSend(studentChannel, maskMessageJson);


        } catch (Exception e){
            log.error("채팅 메시지 전송 실패",e);
            throw new QuestionException(QuestionErrorCode._CHAT_MESSAGE_SEND_FAIL);
        }
    }
}
