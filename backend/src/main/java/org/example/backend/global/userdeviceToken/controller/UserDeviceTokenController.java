package org.example.backend.global.userdeviceToken.controller;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.example.backend.global.security.auth.CustomSecurityUtil;
import org.example.backend.global.security.auth.CustomUserDetails;
import org.example.backend.global.userdeviceToken.dto.request.TokenRegisterRequest;
import org.example.backend.global.userdeviceToken.service.UserDeviceTokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/push")
@RequiredArgsConstructor
public class UserDeviceTokenController {

    private final UserDeviceTokenService tokenService;
    private final CustomSecurityUtil customSecurityUtil;

    @PostMapping("/register")
    public ResponseEntity<String> registerToken(@RequestBody TokenRegisterRequest dto,
                                                @AuthenticationPrincipal CustomUserDetails userDetails) {
        UUID userId = customSecurityUtil.getUserId();
        tokenService.registerToken(userId, dto.getToken());
        return ResponseEntity.ok("Token registered successfully");
    }
}