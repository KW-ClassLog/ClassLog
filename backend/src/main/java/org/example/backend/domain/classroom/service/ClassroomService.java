package org.example.backend.domain.classroom.service;

import org.example.backend.domain.classroom.dto.request.ClassroomRequestDTO;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.lecture.entity.Lecture;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface ClassroomService {
    Classroom createClassroom(ClassroomRequestDTO classroomRequestDTO);
    Classroom getClassroom(UUID classId);
    void deleteClassroom(UUID classId);
    Classroom updateClassroom(UUID classId, ClassroomRequestDTO classroomRequestDTO);
    List<Lecture> getLecturesByClassId(UUID classId);
}
