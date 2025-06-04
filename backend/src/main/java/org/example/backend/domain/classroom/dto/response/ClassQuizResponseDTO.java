package org.example.backend.domain.classroom.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassQuizResponseDTO {
    private String className;
    private List<QuizInfoDTO> quizzes;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuizInfoDTO {
        private int session;
        private String title;
        private String date;
        private String day;
        @JsonFormat(pattern = "HH:mm")
        private String startTime;
        @JsonFormat(pattern = "HH:mm")
        private String endTime;
        private String status;
    }
}
