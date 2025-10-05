package org.example.backend.domain.notificationSetting.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationSettingResponseDTO {

    private boolean quizUpload;
    private boolean quizAnswerUpload;
    private boolean lectureNoteUpload;
    private boolean lectureUpload;
    private boolean recordUpload;
}