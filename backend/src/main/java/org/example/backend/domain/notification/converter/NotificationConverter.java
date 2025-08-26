package org.example.backend.domain.notification.converter;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.notification.dto.response.NotificationResponseDTO;
import org.example.backend.domain.notification.entity.Notification;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class NotificationConverter {

    public NotificationResponseDTO toDTO(Notification notification) {
        return NotificationResponseDTO.builder()
                .notificationId(notification.getId())
                .alarmType(notification.getAlarmType())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }

    public List<NotificationResponseDTO> toResponseDTO(List<Notification> notifications) {
        return notifications.stream()
                .map(this::toDTO)
                .toList();
    }
}
