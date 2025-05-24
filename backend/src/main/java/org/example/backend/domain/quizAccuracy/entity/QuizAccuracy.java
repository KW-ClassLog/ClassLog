package org.example.backend.domain.quizAccuracy.entity;

import jakarta.persistence.*;
import org.example.backend.domain.quiz.entity.Quiz;

import java.util.UUID;

@Entity
@Table(name = "quiz_accuracy")
public class QuizAccuracy {

    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column(name = "correct_rate", nullable = false)
    private double correctRate;
}
