package org.example.backend.domain.studentClass.entity.id;

import lombok.*;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentClassId implements Serializable {
    private String userId;
    private String classId;
}
