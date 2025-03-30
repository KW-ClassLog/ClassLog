package org.example.backend.domain.quiz.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.backend.domain.lecture.entity.Lecture;

@Entity
@Table(name = "quiz")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quiz {

    @Id
    private String id;

    @ManyToOne
    @JoinColumn(name = "lecture_id", nullable = false)
    private Lecture lecture;

    @Column(nullable = false)
    private String quiz;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuizType type;

    private String solution;

}
