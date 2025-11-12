package org.example.backend.domain.quizListOptions.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.backend.domain.quizList.entity.QuizList;
import org.example.backend.global.entitiy.BaseEntity;

import java.util.UUID;

@Entity
@Table(name = "quiz_list_options")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizListOptions extends BaseEntity {
    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "quiz_list_id", nullable = false)
    private QuizList quizListId;

    @Column(name = "text", nullable = false)
    private String text;

    @Column(name = "option_order")
    private int optionOrder;

    public void updateText(String text) {
        this.text = text;
    }
}

