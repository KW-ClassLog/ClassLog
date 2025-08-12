package org.example.backend.domain.quizAnswer.service;

import org.example.backend.domain.quizAnswer.dto.response.QuizResultStudentResponseDTO;

import java.util.UUID;

public interface QuizResultStudentService {
    QuizResultStudentResponseDTO getQuizResult(UUID lectureId);
}
