package org.example.backend.domain.studentClass.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TodayLectureResponseDTO {
    UUID lectureId;
    String ClassName;
    String title;
    LocalDate lectureDate;
    LocalTime startTime;
    LocalTime endTime;
}
