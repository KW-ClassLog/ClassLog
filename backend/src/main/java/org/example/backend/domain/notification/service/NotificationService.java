package org.example.backend.domain.notification.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.classroom.repository.ClassroomRepository;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lecture.repository.LectureRepository;
import org.example.backend.domain.notification.converter.NotificationConverter;
import org.example.backend.domain.notification.dto.response.NotificationResponseDTO;
import org.example.backend.domain.notification.entity.AlarmType;
import org.example.backend.domain.notification.entity.Notification;
import org.example.backend.domain.notification.repository.NotificationRepository;
import org.example.backend.domain.notificationSetting.service.FcmService;
import org.example.backend.domain.notificationSetting.service.NotificationTemplateService;
import org.example.backend.global.userdeviceToken.repository.UserDeviceTokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class NotificationService implements NotificationServiceImpl{
    private final NotificationRepository notificationRepository;
    private final LectureRepository lectureRepository;
    private final ClassroomRepository classroomRepository;
    private final NotificationConverter notificationConverter;
    private final NotificationTemplateService templateService;
    private final UserDeviceTokenRepository tokenRepository;
    private final FcmService fcmService;

    public List<NotificationResponseDTO> getNotificationsByUserId(UUID userId) {
        List<Notification> notificationList =
                notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);

        return notificationList.stream()
                .map(notification -> {
                    Lecture lecture = notification.getLecture();

                    String className = null;
                    if (lecture != null && lecture.getClassroom() != null) {
                        className = lecture.getClassroom().getClassName();
                    }

                    return notificationConverter.toDTO(notification, className);
                })
                .toList();
    }

    public void sendAlarmToProfessor(UUID lectureId, AlarmType type, String senderName, String extra) {
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new RuntimeException("Lecture not found"));

        UUID professorId = lecture.getClassroom().getProfessor().getId();

        String title = templateService.getTitle(type);
        String body = templateService.getBody(type, senderName, extra);

        var tokens = tokenRepository.findAllByUserIdAndIsActiveTrue(professorId);
        tokens.forEach(token ->
                fcmService.sendNotification(token.getFcmToken(), title, body)
        );

        Notification notification = Notification.builder()
                .user(lecture.getClassroom().getProfessor())
                .lecture(lecture)
                .alarmType(type)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(UUID userId) {
        notificationRepository.markAllAsReadByUserId(userId);
    }
}
