package org.example.backend.domain.classroom.service;

import org.example.backend.domain.classroom.converter.ClassroomConverter;
import org.example.backend.domain.classroom.dto.request.ClassroomRequestDTO;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.classroom.repository.ClassroomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClassroomService {

    private ClassroomRepository classroomRepository;
    private ClassroomConverter classroomConverter;

    @Autowired  // 의존성 주입이 필요합니다.
    public ClassroomService(ClassroomConverter classroomConverter, ClassroomRepository classroomRepository) {
        this.classroomConverter = classroomConverter;
        this.classroomRepository = classroomRepository;
    }

// classroom 생성 로직
    public Classroom createClassroom(ClassroomRequestDTO classroomRequestDTO) {
        Classroom classroom = classroomConverter.toEntity(classroomRequestDTO);

        return classroomRepository.save(classroom);
    }
}
