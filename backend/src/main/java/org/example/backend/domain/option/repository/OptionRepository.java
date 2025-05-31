package org.example.backend.domain.option.repository;


import org.example.backend.domain.option.entity.Option;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OptionRepository extends JpaRepository<Option, UUID> {
    List<Option> findByQuizId(UUID quizId);
}
