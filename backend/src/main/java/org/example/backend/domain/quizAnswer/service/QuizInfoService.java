package org.example.backend.domain.quizAnswer.service;

import org.example.backend.domain.quizAnswer.dto.response.QuizInfoResponseDTO;

import java.util.UUID;

public interface QuizInfoService {
    QuizInfoResponseDTO getQuizInfo(UUID lectureId);
}
