package org.example.backend.domain.classroom.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class ClassroomRequestDTO {
    private String className;  // class_name
    private String classDate; // class_date
    private LocalDateTime startDate;  // start_date
    private LocalDateTime endDate;  // end_date
    private UUID professorId;  // professor_id

}
