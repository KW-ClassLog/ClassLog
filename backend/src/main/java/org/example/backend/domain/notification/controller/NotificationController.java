package org.example.backend.domain.notification.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.notification.dto.response.NotificationResponseDTO;
import org.example.backend.domain.notification.service.NotificationService;
import org.example.backend.global.ApiResponse;
import org.example.backend.global.security.auth.CustomSecurityUtil;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
// 알림 목록 조회
public class NotificationController {
    private final NotificationService notificationService;
    private final CustomSecurityUtil customSecurityUtil;

    @GetMapping("")
    public ApiResponse<List<NotificationResponseDTO>> getNotifications() {
        UUID userId = customSecurityUtil.getUserId();


        List<NotificationResponseDTO> notifications = notificationService.getNotificationsByUserId(userId);
        return ApiResponse.onSuccess(notifications);
    }

    @PatchMapping("/read-all")
    public void markAllAsRead() {
        UUID userId = customSecurityUtil.getUserId();
        notificationService.markAllAsRead(userId);
    }
}
