package org.example.backend.domain.quiz.dto.response;

import org.example.backend.domain.option.dto.response.OptionResponseDTO;

import java.util.List;
import java.util.UUID;

public class QuizListResponseDTO {

    private UUID lectureId;
    private List<QuizDTO> quizzes;

    public QuizListResponseDTO(UUID lectureId, List<QuizDTO> quizzes) {
        this.lectureId = lectureId;
        this.quizzes = quizzes;
    }

    public UUID getLectureId() {
        return lectureId;
    }

    public List<QuizDTO> getQuizzes() {
        return quizzes;
    }

    public static class QuizDTO {
        private UUID quizId;
        private int quizOrder;
        private String quizBody;
        private String solution;
        private String type;
        private List<OptionResponseDTO> options;

        public QuizDTO(UUID quizId, int quizOrder, String quizBody, String solution, String type, List<OptionResponseDTO> options) {
            this.quizId = quizId;
            this.quizOrder = quizOrder;
            this.quizBody = quizBody;
            this.solution = solution;
            this.type = type;
            this.options = options;
        }

        public UUID getQuizId() {
            return quizId;
        }

        public int getQuizOrder() {
            return quizOrder;
        }

        public String getQuizBody() {
            return quizBody;
        }

        public String getSolution() {
            return solution;
        }

        public String getType() {
            return type;
        }

        public List<OptionResponseDTO> getOptions() {
            return options;
        }
    }
}