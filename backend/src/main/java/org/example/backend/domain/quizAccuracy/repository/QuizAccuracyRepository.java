package org.example.backend.domain.quizAccuracy.repository;

import org.example.backend.domain.quizAccuracy.entity.QuizAccuracy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface QuizAccuracyRepository extends JpaRepository<QuizAccuracy, UUID> {
    Optional<QuizAccuracy> findByQuizId(UUID quizId);
}
