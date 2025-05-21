package org.example.backend.domain.quiz.service;

import org.example.backend.domain.quiz.dto.request.QuizRequestDTO;
import org.example.backend.domain.quiz.dto.response.QuizResponseDTO;

import java.util.UUID;

public interface QuizService {
    QuizResponseDTO generateQuiz(UUID lectureId, QuizRequestDTO request);
}
