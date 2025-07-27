package org.example.backend.domain.quiz.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.example.backend.domain.option.dto.response.OptionResponseDTO;

import java.util.List;
import java.util.UUID;

@Getter
@AllArgsConstructor
@Builder
public class QuizListResponseDTO {
    private UUID lectureId;
    private List<QuizDTO> quizzes;

    @Getter
    @AllArgsConstructor
    @Builder
    public static class QuizDTO {
        private UUID quizId;
        private int quizOrder;
        private String quizBody;
        private String solution;
        private String type;
        private List<OptionResponseDTO> options;
    }
}