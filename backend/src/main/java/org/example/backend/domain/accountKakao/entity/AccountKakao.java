package org.example.backend.domain.accountKakao.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.backend.domain.user.entity.User;
import org.example.backend.global.entitiy.BaseEntity;

import java.util.UUID;

@Entity
@Table(name = "account_kakao")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountKakao extends BaseEntity {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "kakao_key", nullable = false)
    private String kakaoKey;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}