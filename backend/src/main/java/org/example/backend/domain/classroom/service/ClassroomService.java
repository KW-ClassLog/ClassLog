package org.example.backend.domain.classroom.service;

import org.example.backend.domain.classroom.dto.request.ClassroomRequestDTO;
import org.example.backend.domain.classroom.entity.Classroom;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public interface ClassroomService {
    Classroom createClassroom(ClassroomRequestDTO classroomRequestDTO);
    Classroom getClassroom(UUID classId);
    void deleteClassroom(UUID classId);
    Classroom updateClassroom(UUID classId, ClassroomRequestDTO classroomRequestDTO);
}
