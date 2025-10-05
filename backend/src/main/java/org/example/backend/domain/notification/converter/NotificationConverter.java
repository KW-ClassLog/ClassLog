package org.example.backend.domain.notification.converter;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.notification.dto.response.NotificationResponseDTO;
import org.example.backend.domain.notification.entity.Notification;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class NotificationConverter {

    public NotificationResponseDTO toDTO(Notification notification, String className) {
        return NotificationResponseDTO.builder()
                .notificationId(notification.getId())
                .className(className)
                .alarmType(notification.getAlarmType())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }

    public List<NotificationResponseDTO> toResponseDTO(List<Notification> notifications, Map<UUID, String> classNameMap) {
        return notifications.stream()
                .map(notification -> toDTO(notification, classNameMap.get(notification.getLecture().getId())))
                .toList();
    }
}
