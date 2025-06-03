package org.example.backend.domain.quiz.service;

import org.example.backend.domain.quiz.dto.request.QuizEditRequestDTO;
import org.example.backend.domain.quiz.dto.response.QuizEditResponseDTO;

import java.util.UUID;

public interface QuizEditService {
    QuizEditResponseDTO editQuiz(UUID lectureId, QuizEditRequestDTO request);
}
