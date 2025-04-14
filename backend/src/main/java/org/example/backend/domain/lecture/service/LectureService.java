package org.example.backend.domain.lecture.service;

import org.example.backend.domain.lecture.dto.request.LectureRequestDTO;
import org.example.backend.domain.lecture.entity.Lecture;

public interface LectureService {
    void createLecture(LectureRequestDTO dto);
}
