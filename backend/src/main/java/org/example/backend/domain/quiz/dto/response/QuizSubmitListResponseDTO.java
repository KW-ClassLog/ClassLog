package org.example.backend.domain.quiz.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class QuizSubmitListResponseDTO {
    private UUID lectureId;
    private int submitNum;
    private List<StudentSubmitDTO> studentList;

    @Getter
    @Builder
    @AllArgsConstructor
    public static class StudentSubmitDTO {
        private String name;
        private LocalDateTime submitDate;
    }
}