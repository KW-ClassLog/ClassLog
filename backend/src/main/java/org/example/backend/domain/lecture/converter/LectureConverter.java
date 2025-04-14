package org.example.backend.domain.lecture.converter;

import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.lecture.dto.request.LectureRequestDTO;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lecture.repository.LectureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class LectureConverter {

    @Autowired
    private LectureRepository lectureRepository;

    public Lecture toEntity(LectureRequestDTO dto, Classroom classroom) {
        return Lecture.builder()
                .lectureName(dto.getLectureName())
                .lectureDate(dto.getLectureDate())
                .classroom(classroom)
                .isLectureStart(false)
                .saveAudio(false)
                .build();
    }
}
