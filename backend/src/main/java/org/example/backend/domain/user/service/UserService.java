package org.example.backend.domain.user.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.backend.domain.user.dto.request.ProfileUpdateRequestDTO;
import org.example.backend.domain.user.dto.request.RegisterRequestDTO;
import org.example.backend.domain.user.dto.response.HomeResponseDTO;
import org.example.backend.domain.user.dto.response.ProfileUpdateResponseDTO;
import org.example.backend.domain.user.dto.response.UserProfileResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

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

    //리프레시 토큰 발급
    void getRefreshToken(HttpServletRequest request, HttpServletResponse response);

    // 로그아웃
    void logout(HttpServletRequest request, HttpServletResponse response);

    // 개인정보 수정
    ProfileUpdateResponseDTO updateProfile(ProfileUpdateRequestDTO request);

    // 이미지 업로드
    String uploadProfile(MultipartFile profile, UUID userId);

    // 개인정보 조회
    UserProfileResponseDTO getProfile();

    // 홈 프로필 조회
    HomeResponseDTO.ProfileDTO getHomeProfileByUser();
}
