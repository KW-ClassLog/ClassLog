package org.example.backend.domain.accountKakao.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.backend.domain.user.entity.User;

@Entity
@Table(name = "account_kakao")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountKakao {

    @Id
    @Column(name = "user_id")
    private String userId;

    @Column(name = "kakao_key", nullable = false)
    private String kakaoKey;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}