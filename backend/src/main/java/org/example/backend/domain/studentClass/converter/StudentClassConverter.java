package org.example.backend.domain.studentClass.converter;


import lombok.AllArgsConstructor;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.classroom.exception.ClassroomErrorCode;
import org.example.backend.domain.classroom.exception.ClassroomException;
import org.example.backend.domain.classroom.repository.ClassroomRepository;
import org.example.backend.domain.studentClass.dto.request.StudentClassRequestDTO;
import org.example.backend.domain.studentClass.dto.response.StudentEnrolledResponseDTO;
import org.example.backend.domain.studentClass.dto.response.StudentClassResponseDTO;
import org.example.backend.domain.studentClass.entity.StudentClass;
import org.example.backend.domain.user.entity.User;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@AllArgsConstructor
public class StudentClassConverter {

    private final ClassroomRepository classroomRepository;

    // RequestDTO -> Entity
    public StudentClass toClassEnterRequestDTO(UUID userId, StudentClassRequestDTO dto){

        return StudentClass.builder()
                .classId(dto.getClassId())
                .classNickname(dto.getClassNickname())
                .userId(userId)
                .build();

    }

    // Entity → ResponseDTO
    public StudentClassResponseDTO toResponseDTO(StudentClass studentClass) {

        String className = classroomRepository.findById(studentClass.getClassId())
                .map(Classroom::getClassName)
                .orElseThrow(() -> new ClassroomException(ClassroomErrorCode.CLASS_NOT_FOUND));

        return StudentClassResponseDTO.builder()
                .className(className)
                .classNickname(studentClass.getClassNickname())
                .build();
    }

    // Entity → ResponseDTO
    public StudentEnrolledResponseDTO toStudentEnrolledResponseDTO(StudentClass studentClass, User user){
        return StudentEnrolledResponseDTO.builder()
                .userId(user.getId())
                .name(user.getName())
                .nickname(studentClass.getClassNickname())
                .phoneNumber(user.getPhoneNumber())
                .profileUrl(user.getProfileUrl())
                .organization(user.getOrganization())
                .build();

    }
}
