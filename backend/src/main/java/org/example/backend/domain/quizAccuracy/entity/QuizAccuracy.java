package org.example.backend.domain.quizAccuracy.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.backend.domain.quiz.entity.Quiz;
import org.example.backend.global.entitiy.BaseEntity;

import java.util.UUID;

@Entity
@Table(name = "quiz_accuracy")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class QuizAccuracy extends BaseEntity {

    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column(name = "correct_rate", nullable = false)
    private double correctRate;

    public double getCorrectRate() {
        return this.correctRate;
    }
}
