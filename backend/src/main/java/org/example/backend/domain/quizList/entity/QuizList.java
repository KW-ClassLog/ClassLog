package org.example.backend.domain.quizList.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.quiz.entity.QuizType;
import org.example.backend.domain.quizListOptions.entity.QuizListOptions;
import org.example.backend.global.entitiy.BaseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "quiz_list")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizList extends BaseEntity {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "lecture_id", nullable = false)
    private Lecture lecture;

    @Column(nullable = false)
    private String quiz;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuizType type;

    @Column(nullable = false)
    private String solution;

    @Column(name = "quiz_order", nullable = false)
    private Integer quizOrder;

    @Column(name = "used", length = 1, nullable = false, columnDefinition = "CHAR(1) DEFAULT 'F'")
    private String used;

    @OneToMany(mappedBy = "quizListId", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuizListOptions> quizListOptions = new ArrayList<>();

    public void update(String quizBody, String solution, QuizType type) {
        this.quiz = quizBody;
        this.solution = solution;
        this.type = type;
    }
}

