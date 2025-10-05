package org.example.backend.domain.notificationSetting.dto.request;

public record NotificationSettingPatchRequest(
        Boolean quizUpload,
        Boolean quizAnswerUpload,
        Boolean lectureNoteUpload,
        Boolean lectureUpload,
        Boolean recordUpload
) {}