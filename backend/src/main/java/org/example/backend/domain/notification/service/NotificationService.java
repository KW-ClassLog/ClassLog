package org.example.backend.domain.notification.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.classroom.repository.ClassroomRepository;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lecture.repository.LectureRepository;
import org.example.backend.domain.notification.converter.NotificationConverter;
import org.example.backend.domain.notification.dto.response.NotificationResponseDTO;
import org.example.backend.domain.notification.entity.Notification;
import org.example.backend.domain.notification.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class NotificationService implements NotificationServiceImpl{
    private final NotificationRepository notificationRepository;
    private final LectureRepository lectureRepository;
    private final ClassroomRepository classroomRepository;
    private final NotificationConverter notificationConverter;;

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
}
