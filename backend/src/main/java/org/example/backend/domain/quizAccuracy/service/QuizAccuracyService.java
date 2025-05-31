package org.example.backend.domain.quizAccuracy.service;

import org.example.backend.domain.quizAccuracy.dto.response.QuizAccuracyResponseDTO;

import java.util.UUID;

public interface QuizAccuracyService {
    QuizAccuracyResponseDTO getQuizResult(UUID lectureId);

}
