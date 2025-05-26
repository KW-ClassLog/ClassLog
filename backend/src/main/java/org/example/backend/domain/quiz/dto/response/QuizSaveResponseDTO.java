package org.example.backend.domain.quiz.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import java.util.List;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class QuizSaveResponseDTO {
    private UUID lectureId;
    private int savedCount;
    private List<UUID> quizIds;
}
