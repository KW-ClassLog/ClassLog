package org.example.backend.domain.notification.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.backend.domain.notification.entity.AlarmType;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationResponseDTO {
    private UUID notificationId;
    private AlarmType alarmType;
    private boolean isRead;
    private LocalDateTime createdAt;
}
