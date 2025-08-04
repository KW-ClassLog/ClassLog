package org.example.backend.domain.quizAnswer.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class QuizSubmitRequestDTO {

    private List<AnswerDTO> answers;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnswerDTO {
        private UUID quizId;
        private String answer;
    }
}

