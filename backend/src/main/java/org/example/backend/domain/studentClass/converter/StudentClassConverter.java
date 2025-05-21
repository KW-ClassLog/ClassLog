package org.example.backend.domain.studentClass.converter;


import lombok.AllArgsConstructor;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.classroom.exception.ClassroomErrorCode;
import org.example.backend.domain.classroom.exception.ClassroomException;
import org.example.backend.domain.classroom.repository.ClassroomRepository;
import org.example.backend.domain.studentClass.dto.request.StudentClassRequestDTO;
import org.example.backend.domain.studentClass.dto.response.StudentClassResponseDTO;
import org.example.backend.domain.studentClass.entity.StudentClass;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@AllArgsConstructor
public class StudentClassConverter {

    private final ClassroomRepository classroomRepository;

    public StudentClass toClassEnterRequestDTO(UUID userId, StudentClassRequestDTO dto){

        return StudentClass.builder()
                .classId(dto.getClassId())
                .classNickname(dto.getClassNickname())
                .userId(userId)
                .build();

    }

    public StudentClassResponseDTO toResponseDTO(StudentClass studentClass) {

        String className = classroomRepository.findById(studentClass.getClassId())
                .map(Classroom::getClassName)
                .orElseThrow(() -> new ClassroomException(ClassroomErrorCode.CLASS_NOT_FOUND));

        return StudentClassResponseDTO.builder()
                .className(className)
                .classNickname(studentClass.getClassNickname())
                .build();
    }
}
