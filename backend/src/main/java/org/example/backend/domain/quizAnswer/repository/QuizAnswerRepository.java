package org.example.backend.domain.quizAnswer.repository;

import org.example.backend.domain.quizAnswer.entity.QuizAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;


public interface QuizAnswerRepository extends JpaRepository<QuizAnswer, UUID> {
    List<QuizAnswer> findAllByQuizId(UUID quizId);
    int countByQuizIdAndAnswer(UUID quizId, String answer);
    int countByQuizIdAndIsCollectTrue(UUID quizId);
}
