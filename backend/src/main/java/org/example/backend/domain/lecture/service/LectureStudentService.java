package org.example.backend.domain.lecture.service;

import org.example.backend.domain.lecture.dto.response.StudentTodayLectureResponseDTO;

import java.time.LocalDate;

public interface LectureStudentService {
    StudentTodayLectureResponseDTO getClassListByStudent(LocalDate date);

}
