package org.example.backend.domain.quizAccuracy.dto.response;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizSelectionStatsResponseDTO {

    private List<QuizStatDTO> result;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuizStatDTO {
        private UUID quizId;
        private int quizOrder;
        private String type;


        // MULTIPLE_CHOICE
        @JsonIgnore
        private Map<String, Double> optionRates;

        // TRUE_FALSE
        @JsonIgnore
        private Map<String, Double> oxRates;

        // SHORT_ANSWER
        @JsonInclude(JsonInclude.Include.NON_NULL)
        private List<AnswerRateDTO> top3Answers;

        @JsonInclude(JsonInclude.Include.NON_NULL)
        private List<String> etcAnswers;

        @JsonAnyGetter
        public Map<String, Double> getDynamicRates() {
            if ("multipleChoice".equalsIgnoreCase(this.type) && this.optionRates != null) {
                return this.optionRates;
            }
            if ("trueFalse".equalsIgnoreCase(this.type) && this.oxRates != null) {
                return this.oxRates;
            }
            return Collections.emptyMap();
        }
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnswerRateDTO {
        private String answer;
        private double rate;
    }
}