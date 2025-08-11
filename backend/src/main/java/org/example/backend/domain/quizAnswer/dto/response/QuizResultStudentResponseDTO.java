package org.example.backend.domain.quizAnswer.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizResultStudentResponseDTO {
    private UUID lectureId;
    private List<QuizDTO> quizzes;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuizDTO {
        private UUID quizId;
        private int quizOrder;
        private String quizBody;
        private String solution;
        private String type;
        private String studentAnswer;
        @JsonProperty("isCollect")
        private boolean collect;
        private List<OptionDTO> options;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OptionDTO {
        private UUID id;
        private int optionOrder;
        private String text;
    }
}
