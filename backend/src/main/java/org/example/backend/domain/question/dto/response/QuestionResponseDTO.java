package org.example.backend.domain.question.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.backend.domain.user.entity.Role;

import java.time.LocalDateTime;
import java.util.UUID;

public class QuestionResponseDTO {

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class teacher {

        private UUID studentId;
        private String studentName;
        private String studentProfile;
        private LocalDateTime timestamp;
        private String content;
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class student {

        private LocalDateTime timestamp;
        private String content;
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class beforeChatting {
        private String content;
        private LocalDateTime timestamp;
        private Role role;
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class afterChatting {
        private String content;
        private LocalDateTime timestamp;
        private UUID senderId;
        private Role senderRole;
    }

}
