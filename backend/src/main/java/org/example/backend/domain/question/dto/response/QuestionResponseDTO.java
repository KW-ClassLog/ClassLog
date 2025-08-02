package org.example.backend.domain.question.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

}
