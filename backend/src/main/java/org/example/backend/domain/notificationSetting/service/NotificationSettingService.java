package org.example.backend.domain.notificationSetting.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.notificationSetting.converter.NotificationSettingConverter;
import org.example.backend.domain.notificationSetting.dto.request.NotificationSettingPatchRequest;
import org.example.backend.domain.notificationSetting.dto.response.NotificationSettingResponseDTO;
import org.example.backend.domain.notificationSetting.entity.NotificationSetting;
import org.example.backend.domain.notificationSetting.repository.NotificationSettingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationSettingService implements NotificationSettingServiceImpl{
    private final NotificationSettingRepository notificationSettingRepository;

    @Override
    public NotificationSettingResponseDTO getNotiSetting(UUID userId) {
        NotificationSetting setting = notificationSettingRepository.findById(userId)
                .orElseGet(() -> NotificationSetting.builder()
                        .userId(userId)
                        .quizUpload(true)
                        .quizAnswerUpload(true)
                        .lectureNoteUpload(true)
                        .lectureUpload(true)
                        .recordUpload(true)
                        .build());

        return NotificationSettingConverter.toDTO(setting);
    }

    @Transactional
    public void patchSettings(UUID userId, NotificationSettingPatchRequest req) {
        NotificationSetting entity = notificationSettingRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("알림 설정이 존재하지 않습니다."));

        if (req.quizUpload() != null) entity.setQuizUpload(req.quizUpload());
        if (req.quizAnswerUpload() != null) entity.setQuizAnswerUpload(req.quizAnswerUpload());
        if (req.lectureNoteUpload() != null) entity.setLectureNoteUpload(req.lectureNoteUpload());
        if (req.lectureUpload() != null) entity.setLectureUpload(req.lectureUpload());
        if (req.recordUpload() != null) entity.setRecordUpload(req.recordUpload());
    }

    public void initializeDefaultSettings(UUID userId) {
        // 이미 존재하는 설정이 있으면 중복 생성 방지
        if (notificationSettingRepository.existsByUserId(userId)) return;

        NotificationSetting notificationSetting = NotificationSetting.builder()
                .userId(userId)
                .quizUpload(true)
                .quizAnswerUpload(true)
                .lectureNoteUpload(true)
                .lectureUpload(true)
                .recordUpload(true)
                .build();

        notificationSettingRepository.save(notificationSetting);
    }
}
