package org.example.backend.domain.notificationSetting.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.notificationSetting.dto.response.NotificationSettingResponseDTO;
import org.example.backend.domain.notificationSetting.service.NotificationSettingService;
import org.example.backend.global.ApiResponse;
import org.example.backend.global.security.auth.CustomSecurityUtil;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/notifications/setting")
@RequiredArgsConstructor
public class NotificationSettingController {
    private final NotificationSettingService notificationSettingService;
    private final CustomSecurityUtil customSecurityUtil;

    @GetMapping("")
    public ApiResponse<NotificationSettingResponseDTO> getNotiSetting(){
        UUID userId = customSecurityUtil.getUserId();

        NotificationSettingResponseDTO response = notificationSettingService.getNotiSetting(userId);
        return ApiResponse.onSuccess(response);

    }
}
