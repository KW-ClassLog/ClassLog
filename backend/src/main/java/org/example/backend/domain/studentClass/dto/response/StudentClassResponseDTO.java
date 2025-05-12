package org.example.backend.domain.studentClass.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentClassResponseDTO {

    private UUID classId;
    private String className;
    private String classNickname;

}
