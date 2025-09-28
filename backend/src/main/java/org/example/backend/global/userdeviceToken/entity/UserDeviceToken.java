package org.example.backend.global.userdeviceToken.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.backend.global.entitiy.BaseEntity;
import org.example.backend.domain.user.entity.User;

@Entity
@Table(name = "user_device_token",
        uniqueConstraints = {
                @UniqueConstraint(name = "uniq_token", columnNames = {"fcm_token"})
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDeviceToken extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "fcm_token", nullable = false, length = 512)
    private String fcmToken;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;
}