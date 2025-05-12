package org.example.backend.domain.studentClass.converter;


import lombok.AllArgsConstructor;
import org.example.backend.domain.classroom.exception.ClassroomErrorCode;
import org.example.backend.domain.classroom.exception.ClassroomException;
import org.example.backend.domain.classroom.repository.ClassroomRepository;
import org.example.backend.domain.studentClass.dto.request.ClassEnterRequestDTO;
import org.example.backend.domain.studentClass.entity.StudentClass;
import org.example.backend.domain.user.exception.UserErrorCode;
import org.example.backend.domain.user.exception.UserException;
import org.example.backend.domain.user.repository.UserRepository;
import org.example.backend.global.security.auth.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@AllArgsConstructor
public class StudentClassConverter {

    private final ClassroomRepository classroomRepository;
    private final UserRepository userRepository;

    public StudentClass toClassEnterRequestDTO(ClassEnterRequestDTO classEnterRequestDTO){

        UUID classId = classEnterRequestDTO.getClassId();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        UUID studentId = ((CustomUserDetails) principal).getUser().getId();

        classroomRepository.findById(classId)
                .orElseThrow(() -> new ClassroomException(ClassroomErrorCode.CLASS_NOT_FOUND));

        userRepository.findById(studentId)
                .orElseThrow(() -> new UserException(UserErrorCode._USER_NOT_FOUND));

        return StudentClass.builder()
                .classId(classEnterRequestDTO.getClassId())
                .classNickname(classEnterRequestDTO.getClassNickname())
                .userId(studentId)
                .build();

    }
}
