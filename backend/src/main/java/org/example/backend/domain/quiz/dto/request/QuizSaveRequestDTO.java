package org.example.backend.domain.quiz.dto.request;

import lombok.Getter;
import java.util.List;

@Getter
public class QuizSaveRequestDTO {
    private List<QuizDTO> quizzes;

    @Getter
    public static class QuizDTO {
        private Integer quizOrder;
        private String quizBody;
        private String solution;
        private List<String> options;
        private String type;
    }
}
