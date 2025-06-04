package org.example.backend.domain.classroom.service;

import org.example.backend.domain.classroom.dto.response.ClassQuizResponseDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface ClassQuizService {
    List<ClassQuizResponseDTO> getQuizzesByClass(UUID classId);
}