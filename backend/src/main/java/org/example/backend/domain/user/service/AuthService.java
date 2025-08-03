package org.example.backend.domain.user.service;

import jakarta.servlet.http.HttpServletResponse;
import org.example.backend.domain.user.dto.request.OnboardingRequestDTO;
import org.example.backend.domain.user.dto.response.LoginResponseDTO;

public interface AuthService {
    // 카카오 로그인
    LoginResponseDTO.KakaoLoginResponse kakaoLogin(String code, HttpServletResponse response);
    // 카카오 회원가입 온보딩
    void kakaoOnboarding(OnboardingRequestDTO dto, HttpServletResponse response);
}
