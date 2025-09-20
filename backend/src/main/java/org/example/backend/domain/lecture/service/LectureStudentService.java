package org.example.backend.domain.lecture.service;

import org.example.backend.domain.lecture.dto.response.LectureResponseDTO;
import org.example.backend.domain.lecture.dto.response.StudentTodayLectureResponseDTO;

import java.time.LocalDate;
import java.util.UUID;

public interface LectureStudentService {
    StudentTodayLectureResponseDTO getClassListByStudent(LocalDate date);
    LectureResponseDTO getLecture(UUID lectureId);

}
