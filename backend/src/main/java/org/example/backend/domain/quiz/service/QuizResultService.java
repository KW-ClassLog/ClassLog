package org.example.backend.domain.quiz.service;

import org.example.backend.domain.quiz.dto.response.QuizSubmitListResponseDTO;

import java.util.UUID;

public interface QuizResultService {
    QuizSubmitListResponseDTO getQuizSubmitList(UUID lectureId);
}
