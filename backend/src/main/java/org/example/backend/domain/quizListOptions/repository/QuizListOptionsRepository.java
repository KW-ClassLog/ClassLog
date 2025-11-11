package org.example.backend.domain.quizListOptions.repository;

import org.example.backend.domain.quizListOptions.entity.QuizListOptions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuizListOptionsRepository extends JpaRepository<QuizListOptions, UUID> {
    List<QuizListOptions> findByQuizListId_Id(UUID quizListId);
}