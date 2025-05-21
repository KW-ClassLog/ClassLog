package org.example.backend.global.security.auth;

import org.example.backend.domain.user.entity.Role;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class CustomSecurityUtil {

    // userId 추출
    public UUID getUserId() {
        CustomUserDetails userDetails = getCurrentUserDetails();
        return userDetails.getUser().getId();
    }

    // Role 추출
    public Role getUserRole() {
        CustomUserDetails userDetails = getCurrentUserDetails();
        return userDetails.getUser().getRole();
    }

    // CustomUserDetails 객체 추출
    private static CustomUserDetails getCurrentUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        return (CustomUserDetails) authentication.getPrincipal();
    }
}
