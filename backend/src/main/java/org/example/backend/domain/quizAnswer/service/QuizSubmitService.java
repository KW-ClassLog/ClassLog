package org.example.backend.domain.quizAnswer.service;

import org.example.backend.domain.quizAnswer.dto.request.QuizSubmitRequestDTO;
import org.example.backend.domain.quizAnswer.dto.response.QuizSubmitResponseDTO;

public interface QuizSubmitService {
    QuizSubmitResponseDTO submitQuizAnswers(QuizSubmitRequestDTO request);

}
