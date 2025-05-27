package org.example.backend.domain.quiz.repository;

import org.example.backend.domain.quiz.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface QuizRepository extends JpaRepository<Quiz, UUID> {
    List<Quiz> findByLectureId(UUID lectureId);
}
