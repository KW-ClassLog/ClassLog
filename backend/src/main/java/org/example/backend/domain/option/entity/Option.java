package org.example.backend.domain.option.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.backend.domain.quiz.entity.Quiz;

import java.util.UUID;

@Entity
@Table(name = "options")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    @Column(name = "option_order")
    private int optionOrder;

    public void updateText(String text) {
        this.text = text;
    }
}
