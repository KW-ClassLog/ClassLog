package org.example.backend.domain.classroom.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
public class ClassroomResponseDTO {
    private UUID classId;
    private String className;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private UUID professorId;
    private String professorName;
}