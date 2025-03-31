package org.example.backend.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.example.backend.domain.accountKakao.entity.AccountKakao;
import org.example.backend.domain.accountLocal.entity.AccountLocal;
import org.example.backend.domain.notification.entity.Notification;
import org.example.backend.domain.quizAnswer.entity.QuizAnswer;


@Entity
@Table(name = "User")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(nullable = false)
    private String name;

    private String organization;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    private LocalDateTime deletedAt;

    @OneToOne(mappedBy = "user")
    private AccountKakao accountKakao;

    @OneToOne(mappedBy = "user")
    private AccountLocal accountLocal;

    @OneToMany(mappedBy = "user")
    private List<QuizAnswer> quizAnswers;

    @OneToMany(mappedBy = "user")
    private List<Notification> notifications;
}