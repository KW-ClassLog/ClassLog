package org.example.backend.domain.classroom.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
public class ClassroomResponseDTO {
    private UUID classId;
    private String className;
    private LocalDate startDate;
    private LocalDate endDate;
    private String classDate;
}