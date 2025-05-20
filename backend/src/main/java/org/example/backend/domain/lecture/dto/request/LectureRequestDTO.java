package org.example.backend.domain.lecture.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Setter
public class LectureRequestDTO {

    @NotNull(message = "Lecture name is required")
    private String lectureName;

    @NotNull(message = "LectureDate is required")
    private LocalDate lectureDate;

    @NotNull(message = "class_id is required")
    private UUID classId;

    @NotNull(message = "startTime is required")
    private LocalTime startTime;

    @NotNull(message = "endTime is required")
    private LocalTime endTime;



}
