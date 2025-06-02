package org.example.backend.domain.quiz.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class QuizEditRequestDTO {
    private List<QuizDTO> quizzes;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuizDTO {
        private int quizOrder;
        private String quizBody;
        private String solution;
        private String type;
        private List<OptionDTO> options;

        @Getter
        @NoArgsConstructor
        @AllArgsConstructor
        public static class OptionDTO {
            private int optionOrder;
            private String option;
        }
    }
}