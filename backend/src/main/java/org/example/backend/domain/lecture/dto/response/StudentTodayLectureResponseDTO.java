package org.example.backend.domain.lecture.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class StudentTodayLectureResponseDTO {
    private int todayTotal;
    private int todayDone;
    private int todayLeft;
    private List<LectureDTO> todayLectures;

    @Getter
    @AllArgsConstructor
    public static class LectureDTO {
        private UUID lectureId;
        private String lectureName;
        private LocalDate lectureDate;
        private String className;
        @JsonFormat(pattern = "HH:mm")
        private LocalTime startTime;
        @JsonFormat(pattern = "HH:mm")
        private LocalTime endTime;
        private Integer session;
    }
}
