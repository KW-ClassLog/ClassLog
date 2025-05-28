package org.example.backend.domain.quizAnswer.service;

import org.example.backend.domain.quizAnswer.dto.response.QuizSubmitListResponseDTO;

import java.util.UUID;

public interface QuizAnswerService {
    QuizSubmitListResponseDTO getQuizSubmitList(UUID lectureId);
}
