package org.example.backend.domain.accountLocal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.backend.domain.user.entity.User;

@Entity
@Table(name = "account_local")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountLocal {

    @Id
    @Column(name = "user_id")
    private String userId;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
