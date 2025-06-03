package org.example.backend.domain.option.repository;

import jakarta.transaction.Transactional;
import org.example.backend.domain.option.entity.Option;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface OptionRepository extends JpaRepository<Option, UUID> {
    List<Option> findByQuizId(UUID quizId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Option o WHERE o.quiz.id = :quizId")
    void deleteByQuizId(@Param("quizId") UUID quizId);

}
