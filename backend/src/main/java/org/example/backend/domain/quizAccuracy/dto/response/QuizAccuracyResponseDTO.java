package org.example.backend.domain.quizAccuracy.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class QuizAccuracyResponseDTO {
    private int totalQuizCount;
    private double averageCorrectRate;
    private List<QuizDTO> quizList;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class QuizDTO {
        private UUID quizId;
        private int quizOrder;
        private String type;
        private String quizBody;
        private double correctRate;
        private String solution;

        // shortAnswer용
        private Integer count;

        // multipleChoice, trueFalse용
        private List<OptionCountDTO> options;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OptionCountDTO {
        private Integer optionOrder;
        private String option;
        private Integer count;
    }
}
