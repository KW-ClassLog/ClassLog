package org.example.backend.domain.quizAnswer.converter;

import org.example.backend.domain.quiz.entity.Quiz;
import org.example.backend.domain.quizAnswer.dto.response.QuizSubmitResponseDTO;
import org.example.backend.domain.quizAnswer.entity.QuizAnswer;
import org.example.backend.domain.user.repository.UserRepository;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class QuizAnswerConverter {

    public static QuizAnswer toEntity(UUID userId, Quiz quiz, String answer, boolean isCollect, UserRepository userRepository) {
        return QuizAnswer.builder()
                .quiz(quiz)
                .user(userRepository.getReferenceById(userId))
                .answer(answer)
                .isCollect(isCollect)
                .build();
    }

    public static QuizSubmitResponseDTO toSubmitResponse(UUID userId, int savedCount) {
        return QuizSubmitResponseDTO.builder()
                .userId(userId)
                .savedCount(savedCount)
                .build();
    }


}