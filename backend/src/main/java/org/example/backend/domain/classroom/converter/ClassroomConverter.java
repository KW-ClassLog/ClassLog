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
import java.util.UUID;

@Component
public class ClassroomConverter {

    @Autowired
    private UserRepository userRepository;

    public Classroom toEntity(ClassroomRequestDTO dto, UUID userId) {
        User professor = userRepository.findById(userId)
                .orElseThrow(() -> new ClassroomException(ClassroomErrorCode.PROFESSOR_NOT_FOUND));
        return Classroom.builder()
                .className(dto.getClassName())
                .classDate(dto.getClassDate())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .professor(professor)
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
                .professorName(classroom.getProfessor().getName())
                .build();
    }
}