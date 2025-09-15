package org.example.backend.domain.question.dto.request;

import lombok.*;
import org.example.backend.domain.user.entity.Role;

import java.time.LocalDateTime;
import java.util.UUID;

public class MessageRequestDTO {
    @Getter
    @Builder
    public static class MessageDTO {
        private UUID senderId;
        private String senderName;
        private String content;
        private Role role;
        private LocalDateTime timestamp;
    }
}

