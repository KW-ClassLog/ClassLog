package org.example.backend.domain.classroom.converter;

import org.example.backend.domain.classroom.dto.request.ClassroomRequestDTO;
import org.example.backend.domain.classroom.dto.response.ClassroomResponseDTO;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.classroom.exception.ClassroomErrorCode;
import org.example.backend.domain.classroom.exception.ClassroomException;
import org.example.backend.domain.user.entity.User;
import org.example.backend.domain.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ClassroomConverter {

    @Autowired
    private UserRepository userRepository;

    public Classroom toEntity(ClassroomRequestDTO classroomRequestDTO) {
        User professor = userRepository.findById(classroomRequestDTO.getProfessorId())
                .orElseThrow(() -> new ClassroomException(ClassroomErrorCode.PROFESSOR_NOT_FOUND));
        return Classroom.builder()
                .className(classroomRequestDTO.getClassName())
                .classDate(classroomRequestDTO.getClassDate())
                .startDate(classroomRequestDTO.getStartDate())
                .endDate(classroomRequestDTO.getEndDate())
                .professor(professor)  // professorId로 찾은 User 객체를 설정
                .build();
    }

    // Entity → ResponseDTO
    public ClassroomResponseDTO toResponseDTO(Classroom classroom) {
        return ClassroomResponseDTO.builder()
                .classId(classroom.getId())
                .className(classroom.getClassName())
                .startDate(classroom.getStartDate())
                .endDate(classroom.getEndDate())
                .professorId(classroom.getProfessor().getId())
                .build();
    }
}