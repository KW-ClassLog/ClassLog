package org.example.backend.domain.quiz.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lectureNoteMapping.entity.LectureNoteMapping;
import org.example.backend.domain.option.entity.Option;
import org.example.backend.domain.quizAccuracy.entity.QuizAccuracy;
import org.example.backend.domain.quizAnswer.entity.QuizAnswer;
import org.example.backend.global.entitiy.BaseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "quiz")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quiz extends BaseEntity {

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

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Option> optionList = new ArrayList<>();

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuizAccuracy> quizAccuracyList = new ArrayList<>();

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuizAnswer> quizAnswerList = new ArrayList<>();

    public void update(String quizBody, String solution, QuizType type) {
        this.quiz = quizBody;
        this.solution = solution;
        this.type = type;
    }
}

