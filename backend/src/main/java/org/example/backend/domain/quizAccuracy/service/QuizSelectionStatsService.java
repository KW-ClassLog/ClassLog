package org.example.backend.domain.quizAccuracy.service;

import org.example.backend.domain.quizAccuracy.dto.response.QuizSelectionStatsResponseDTO;

import java.util.UUID;

public interface QuizSelectionStatsService {
    QuizSelectionStatsResponseDTO getQuizSelectionStats(UUID lectureId);}
