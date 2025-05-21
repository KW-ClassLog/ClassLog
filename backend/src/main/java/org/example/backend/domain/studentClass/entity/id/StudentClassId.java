package org.example.backend.domain.studentClass.entity.id;

import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentClassId implements Serializable {
    private UUID userId;
    private UUID classId;
}
