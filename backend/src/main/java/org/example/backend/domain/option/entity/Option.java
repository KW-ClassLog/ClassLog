package org.example.backend.domain.option.entity;

import jakarta.persistence.*;
import org.example.backend.domain.quiz.entity.Quiz;

import java.util.UUID;

@Entity
@Table(name = "option")
public class Option {
    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column(name = "text", nullable = false)
    private String text;

    @Column(name = "order", nullable = false)
    private int order;
}
