package org.example.backend.domain.classroom.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ClassroomRequestDTO {

    @NotEmpty(message = "Class name is required")
    private String className;  // class_name

    @NotEmpty(message = "Class date is required")
    private String classDate; // class_date

    @NotNull(message = "Start date is required")
    private LocalDate startDate;  // start_date

    @NotNull(message = "end date is required")

    private LocalDate endDate;  // end_date


}
