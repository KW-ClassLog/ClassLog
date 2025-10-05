package org.example.backend.domain.notificationSetting.repository;

import org.example.backend.domain.notificationSetting.entity.NotificationSetting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationSettingRepository extends JpaRepository<NotificationSetting, String> {
}
