package org.example.backend.domain.question.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.domain.question.dto.request.MessageRequestDTO;
import org.example.backend.domain.question.service.ChatService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * STOMP 메시지 수신 & Redis Pub/Sub으로 전달
 */
@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    /**
     * 클라이언트기 "/pub/lecture/{lectureId}"로 메시지를 전송하면 해당 메시지를 redis pub/sub 채널로 publish
     * @param lectureId
     * @param messageDTO
     */
    @MessageMapping("/lecture/{lectureId}")
    public void sendMessage(@DestinationVariable UUID lectureId, MessageRequestDTO.MessageDTO messageDTO) {
        log.info("메시지 수신: {}", messageDTO);

        messageDTO.setLectureId(lectureId);

        chatService.sendMessage(messageDTO);
    }
}
