package org.example.backend.domain.quizAnswer.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.backend.domain.quiz.entity.Quiz;
import org.example.backend.domain.user.entity.User;
import org.example.backend.global.entitiy.BaseEntity;

import java.util.UUID;

@Entity
@Table(name = "quiz_answer")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizAnswer extends BaseEntity {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String answer;
}