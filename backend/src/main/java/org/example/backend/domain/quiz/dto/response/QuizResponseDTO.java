package org.example.backend.domain.quiz.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class QuizResponseDTO {
    private UUID lectureId;
    private List<QuizDTO> quizzes;

    @Getter
    @Builder
    @AllArgsConstructor
    public static class QuizDTO {
        private String quizBody;
        private String solution;
        private String type;


        @JsonInclude(JsonInclude.Include.NON_EMPTY)
        private List<String> options;
    }
}