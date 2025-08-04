package org.example.backend.domain.lecture.converter;

import org.example.backend.domain.lecture.dto.response.StudentTodayLectureResponseDTO;
import org.example.backend.domain.lecture.entity.Lecture;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class LectureStudentConverter {
    public StudentTodayLectureResponseDTO.LectureDTO toStudentLectureDTO(Lecture lecture, String className, int session) {
        return new StudentTodayLectureResponseDTO.LectureDTO(
                lecture.getId(),
                lecture.getLectureName(),
                lecture.getLectureDate(),
                className,
                lecture.getStartTime(),
                lecture.getEndTime(),
                session
        );
    }

    public StudentTodayLectureResponseDTO toStudentLectureListDTO(List<StudentTodayLectureResponseDTO.LectureDTO> lectures, int todayDone) {
        int todayTotal = lectures.size();
        int todayLeft = todayTotal - todayDone;

        return new StudentTodayLectureResponseDTO(
                todayTotal,
                todayDone,
                todayLeft,
                lectures
        );
    }
}
