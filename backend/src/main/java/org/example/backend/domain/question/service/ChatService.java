package org.example.backend.domain.question.service;

import org.example.backend.domain.question.dto.request.MessageRequestDTO;

public interface ChatService {
    void sendMessage(MessageRequestDTO.MessageDTO messageDTO);
}
