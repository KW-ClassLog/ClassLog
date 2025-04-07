package org.example.backend.domain.classroom.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class ClassroomRequestDTO {

    @NotEmpty(message = "Class name is required")
    private String className;  // class_name

    @NotEmpty(message = "Class date is required")
    private String classDate; // class_date

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;  // start_date

    @NotNull(message = "end date is required")
    private LocalDateTime endDate;  // end_date

    private UUID professorId;  // professor_id

}
