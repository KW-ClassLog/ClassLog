package org.example.backend.domain.accountLocal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.backend.domain.user.entity.User;
import org.example.backend.global.entitiy.BaseEntity;

import java.util.UUID;

@Entity
@Table(name = "account_local")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountLocal extends BaseEntity {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
