package org.example.backend.domain.quizAnswer.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizInfoResponseDTO {
    private String title;
    private String quizDate;
    private String quizDay;
}
