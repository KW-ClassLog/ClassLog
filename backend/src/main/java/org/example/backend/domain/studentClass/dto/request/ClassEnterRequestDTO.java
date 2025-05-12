package org.example.backend.domain.studentClass.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ClassEnterRequestDTO {

    UUID class_id;
    UUID student_id;
    String class_nickname;
}
