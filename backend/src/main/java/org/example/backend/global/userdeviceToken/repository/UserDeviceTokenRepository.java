package org.example.backend.global.userdeviceToken.repository;

import org.example.backend.global.userdeviceToken.entity.UserDeviceToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserDeviceTokenRepository extends JpaRepository<UserDeviceToken, Long> {
    Optional<UserDeviceToken> findByFcmToken(String token);

    List<UserDeviceToken> findAllByUserIdAndIsActiveTrue(UUID userId);
}