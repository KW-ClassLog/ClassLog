package org.example.backend.domain.notificationSetting.repository;

import org.example.backend.domain.notificationSetting.entity.NotificationSetting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface NotificationSettingRepository extends JpaRepository<NotificationSetting, UUID> {
    boolean existsByUserId(UUID userId);
}
