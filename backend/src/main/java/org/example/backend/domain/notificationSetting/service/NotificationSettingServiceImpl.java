package org.example.backend.domain.notificationSetting.service;

import org.example.backend.domain.notificationSetting.dto.request.NotificationSettingPatchRequest;
import org.example.backend.domain.notificationSetting.dto.response.NotificationSettingResponseDTO;

import java.util.UUID;

public interface NotificationSettingServiceImpl {
    NotificationSettingResponseDTO getNotiSetting(UUID userId);

    void patchSettings(UUID userId, NotificationSettingPatchRequest req);
}
