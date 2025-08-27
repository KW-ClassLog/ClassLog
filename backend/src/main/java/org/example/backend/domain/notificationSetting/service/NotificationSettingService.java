package org.example.backend.domain.notificationSetting.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.notificationSetting.converter.NotificationSettingConverter;
import org.example.backend.domain.notificationSetting.dto.response.NotificationSettingResponseDTO;
import org.example.backend.domain.notificationSetting.entity.NotificationSetting;
import org.example.backend.domain.notificationSetting.repository.NotificationSettingRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationSettingService implements NotificationSettingServiceImpl{
    private final NotificationSettingRepository notificationSettingRepository;

    @Override
    public NotificationSettingResponseDTO getNotiSetting(UUID userId) {
        NotificationSetting setting = notificationSettingRepository.findById(userId.toString())
                .orElseGet(() -> NotificationSetting.builder()
                        .userId(userId.toString())
                        .quizUpload(true)
                        .quizAnswerUpload(true)
                        .lectureNoteUpload(true)
                        .lectureUpload(true)
                        .recordUpload(true)
                        .build());

        return NotificationSettingConverter.toDTO(setting);
    }
}
