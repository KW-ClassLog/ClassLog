package org.example.backend.domain.user.service;

import jakarta.servlet.http.HttpServletRequest;
import org.example.backend.domain.user.dto.request.RegisterRequestDTO;

public interface UserService {

    //회원가입
    void registerUser(RegisterRequestDTO request);

    // 이메일 중복 체크
    void validateEmailDuplication(String email);

    // 이메일이 존재 여부 확인
    boolean existEmail(String email);

    // 임시비번 업데이트
    void updateTempPassword(String email, String tempPassword);

    // 비번 재설정
    void updatePassword(String currentPassword,String newPassword);

    // 쿠키에서 리프레시 토큰 추출
    String extractRefreshToken(HttpServletRequest request);
}
