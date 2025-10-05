package org.example.backend.domain.notificationSetting.converter;

import org.example.backend.domain.notificationSetting.dto.response.NotificationSettingResponseDTO;
import org.example.backend.domain.notificationSetting.entity.NotificationSetting;

public class NotificationSettingConverter {
    public static NotificationSettingResponseDTO toDTO(NotificationSetting setting) {
        return NotificationSettingResponseDTO.builder()
                .quizUpload(setting.isQuizUpload())
                .quizAnswerUpload(setting.isQuizAnswerUpload())
                .lectureNoteUpload(setting.isLectureNoteUpload())
                .lectureUpload(setting.isLectureUpload())
                .recordUpload(setting.isRecordUpload())
                .build();
    }
}