package org.example.backend.global.userdeviceToken.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.user.entity.User;
import org.example.backend.domain.user.repository.UserRepository;
import org.example.backend.global.userdeviceToken.entity.UserDeviceToken;
import org.example.backend.global.userdeviceToken.repository.UserDeviceTokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserDeviceTokenService {

    private final UserDeviceTokenRepository repository;
    private final UserRepository userRepository;

    @Transactional
    public void registerToken(UUID userId, String token) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 이미 등록된 토큰이면 업데이트
        UserDeviceToken existing = repository.findByFcmToken(token).orElse(null);
        if (existing != null) {
            existing.setUser(user);
            existing.setActive(true);
        } else {
            UserDeviceToken newToken = UserDeviceToken.builder()
                    .user(user)
                    .fcmToken(token)
                    .isActive(true)
                    .build();
            repository.save(newToken);
        }
    }
}