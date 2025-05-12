package org.example.backend.domain.lecture.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class LectureRequestDTO {

    @NotNull(message = "Lecture name is required")
    private String lectureName;

    @NotNull(message = "LectureDate is required")
    private LocalDate lectureDate;

    @NotNull(message = "classId is required")
    private UUID class_id;



}
