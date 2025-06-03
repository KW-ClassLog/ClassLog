package org.example.backend.domain.quiz.service;

import org.example.backend.domain.quiz.dto.request.QuizRequestDTO;
import org.example.backend.domain.quiz.dto.request.QuizSaveRequestDTO;
import org.example.backend.domain.quiz.dto.response.QuizResponseDTO;
import org.example.backend.domain.quiz.dto.response.QuizSaveResponseDTO;

import java.util.UUID;

public interface QuizService {
    // 퀴즈 생성 및 재생성
    QuizResponseDTO generateQuiz(UUID lectureId, QuizRequestDTO request, boolean isReGenerate);
    // 퀴즈 저장
    QuizSaveResponseDTO saveQuiz(UUID lectureId, QuizSaveRequestDTO request);
}
