package org.example.backend.domain.quizAnswer.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizSubmitResponseDTO {
    private UUID userId;
    private int savedCount;
}