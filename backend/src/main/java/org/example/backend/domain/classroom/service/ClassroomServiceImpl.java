package org.example.backend.domain.classroom.service;

import org.example.backend.domain.classroom.converter.ClassroomConverter;
import org.example.backend.domain.classroom.dto.request.ClassroomRequestDTO;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.classroom.exception.ClassroomErrorCode;
import org.example.backend.domain.classroom.exception.ClassroomException;
import org.example.backend.domain.classroom.repository.ClassroomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class ClassroomServiceImpl implements ClassroomService {

    private ClassroomRepository classroomRepository;
    private ClassroomConverter classroomConverter;

    //의존성 주입
    @Autowired
    public ClassroomServiceImpl(ClassroomConverter classroomConverter, ClassroomRepository classroomRepository) {
        this.classroomConverter = classroomConverter;
        this.classroomRepository = classroomRepository;
    }

    // Classroom 생성
    public Classroom createClassroom(ClassroomRequestDTO classroomRequestDTO) {
        Classroom classroom = classroomConverter.toEntity(classroomRequestDTO);

        return classroomRepository.save(classroom);
    }
    // Classroom 조회
    public Classroom getClassroom(UUID classId) {
        return classroomRepository.findById(classId)
                .orElseThrow(() -> new ClassroomException(ClassroomErrorCode.CLASS_NOT_FOUND)); // 예외 처리
    }
    // Classroom 삭제
    public void deleteClassroom(UUID classId) {
        Classroom classroom = classroomRepository.findById(classId)
                .orElseThrow(() -> new ClassroomException(ClassroomErrorCode.CLASS_NOT_FOUND));

        classroomRepository.delete(classroom);
    }

    // Classroom 수정
    public Classroom updateClassroom(UUID classId, ClassroomRequestDTO classroomRequestDTO) {
        Classroom classroom = classroomRepository.findById(classId)
                .orElseThrow(() -> new ClassroomException(ClassroomErrorCode.CLASS_NOT_FOUND));
        if (classroomRequestDTO.getClassName() != null) {
            classroom.setClassName(classroomRequestDTO.getClassName());
        }
        if (classroomRequestDTO.getClassDate() != null) {
            classroom.setClassDate(classroomRequestDTO.getClassDate());
        }
        if (classroomRequestDTO.getStartDate() != null) {
            classroom.setStartDate(classroomRequestDTO.getStartDate());
        }
        if (classroomRequestDTO.getEndDate() != null) {
            classroom.setEndDate(classroomRequestDTO.getEndDate());
        }

        return classroomRepository.save(classroom);
    }
}
