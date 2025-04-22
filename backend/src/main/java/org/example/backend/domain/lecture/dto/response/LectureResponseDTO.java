package org.example.backend.domain.lecture.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LectureResponseDTO {
    private UUID lectureId;
    private String classId;
    private String lectureName;
    private LocalDate lectureDate;
    private Integer session;
}
