package org.example.backend.domain.question.dto.request;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

public class MessageRequestDTO {
    @Getter
    @Setter
    public static class MessageDTO {
        private UUID senderId;
        private String senderName;
        private String content;
        private UUID lectureId;
    }
}

