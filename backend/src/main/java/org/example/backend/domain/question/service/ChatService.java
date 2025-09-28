package org.example.backend.domain.question.service;

import org.example.backend.domain.question.dto.request.MessageRequestDTO;

import java.util.UUID;

public interface ChatService {
    void sendMessage(UUID lectureId, MessageRequestDTO.MessageDTO messageDTO, UUID userId, String role);
}
