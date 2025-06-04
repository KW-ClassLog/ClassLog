package org.example.backend.domain.classroom.service;

import org.example.backend.domain.classroom.dto.response.ClassQuizResponseDTO;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public interface ClassQuizService {
    ClassQuizResponseDTO getQuizzesByClass(UUID classId);
}