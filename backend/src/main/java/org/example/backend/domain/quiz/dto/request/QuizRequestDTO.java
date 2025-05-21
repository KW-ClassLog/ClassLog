package org.example.backend.domain.quiz.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class QuizRequestDTO {
    @NotNull(message = "useAudio is required")
    private boolean useAudio;
}
