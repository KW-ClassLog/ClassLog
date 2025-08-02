package org.example.backend.domain.question.repository;

import org.example.backend.domain.question.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByLectureId(UUID lectureId);
}
