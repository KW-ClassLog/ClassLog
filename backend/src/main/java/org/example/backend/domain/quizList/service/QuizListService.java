package org.example.backend.domain.quizList.service;


import org.example.backend.domain.quiz.dto.response.QuizResponseDTO;

import java.util.UUID;

public interface QuizListService {
    QuizResponseDTO createRandomQuizSet(UUID lectureId);
    QuizResponseDTO recreateRandomQuizSet(UUID lectureId);
}
