package org.example.backend.domain.studentClass.dto.request;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Data
public class StudentClassRequestDTO {

    UUID classId;
    String classNickname;
}
