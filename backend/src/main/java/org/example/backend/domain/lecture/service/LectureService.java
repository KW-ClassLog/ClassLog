package org.example.backend.domain.lecture.service;

import org.example.backend.domain.lecture.dto.request.LectureRequestDTO;
import org.example.backend.domain.lecture.dto.response.LectureResponseDTO;
import org.example.backend.domain.lecture.entity.Lecture;

import java.util.UUID;

public interface LectureService {
    void createLecture(LectureRequestDTO dto);

    LectureResponseDTO getLectureDetail(UUID lectureId);

    void updateLecture(UUID lectureId, LectureRequestDTO dto);

    void deleteLecture(UUID lectureId);
}
