package org.example.backend.domain.user.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend.domain.user.dto.request.*;
import org.example.backend.domain.user.dto.response.*;
import org.example.backend.domain.user.exception.UserErrorCode;
import org.example.backend.domain.user.exception.UserException;
import org.example.backend.domain.user.service.AuthService;
import org.example.backend.domain.user.service.MailService;
import org.example.backend.domain.user.service.UserRedisService;
import org.example.backend.domain.user.service.UserService;
import org.example.backend.global.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.spec.InvalidKeySpecException;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final MailService mailService;
    private final UserRedisService userRedisService;
    private final AuthService authService;

    // 회원가입
    @PostMapping
    public ApiResponse<String> register(@Valid @RequestBody RegisterRequestDTO registerRequestDTO){
        userService.registerUser(registerRequestDTO);
        return ApiResponse.onSuccess("Register successfully");
    }

    // 개인 정보 조회
    @GetMapping("/me")
    public ApiResponse<UserProfileResponseDTO> profile() throws IOException, InvalidKeySpecException{
        UserProfileResponseDTO response = userService.getProfile();
        return ApiResponse.onSuccess(response);
    }

    // 이메일 인증번호 전송
    @PostMapping("/verify-email")
    public ApiResponse<EmailResponseDTO> sendEmailCode(@Valid @RequestBody EmailRequestDTO emailRequestDTO){
        // 이메일 중복 체크
        userService.validateEmailDuplication(emailRequestDTO.getEmail());

        // 이메일 인증번호 전송
        int authCode = mailService.sendVerificationCode(emailRequestDTO.getEmail());

        EmailResponseDTO responseDTO = new EmailResponseDTO(authCode);
        return ApiResponse.onSuccess(responseDTO);
    }

    // 임시 비번 전송
    @PostMapping("/password/temp")
    public ApiResponse<String> sendTempPwd(@Valid @RequestBody EmailRequestDTO emailRequestDTO){
        String email = emailRequestDTO.getEmail();
        // 등록된 회원인지 치크
        if(!userService.existEmail(email)){
            throw new UserException(UserErrorCode._EMAIL_NOT_FOUND);
        }

        // 이메일 임시비번 전송
        int tempPassword = mailService.sendTemporaryPassword(emailRequestDTO.getEmail());

        // 레디스 저장
        userRedisService.setTemporaryPassword(email, String.valueOf(tempPassword),600);

        // DB 업데이트
        userService.updateTempPassword(email,String.valueOf(tempPassword));

        return ApiResponse.onSuccess("임시 비밀번호 발급 성공");
    }

    // 비밀번호 재설정
    @PatchMapping("/password/reset")
    public ApiResponse<String> updatePwd(@RequestBody @Valid ResetPwdRequestDTO resetPwdRequestDTO){
        userService.updatePassword(resetPwdRequestDTO.getPassword(),resetPwdRequestDTO.getNewPassword());

        return ApiResponse.onSuccess("비밀번호 재설정 성공");
    }

    // 리프레시 토큰 요청
    @PostMapping("/refresh")
    public ApiResponse<String> refreshAccessToken(HttpServletRequest request, HttpServletResponse response) {
        userService.getRefreshToken(request,response);

        return ApiResponse.onSuccess("리프레시 토큰 발급 성공");
    }

    // 로그아웃
    @PostMapping("/logout")
    public ApiResponse<String> logout(HttpServletRequest request,HttpServletResponse response){
        userService.logout(request,response);

        return ApiResponse.onSuccess("로그아웃 성공");
    }

    // 개인정보 수정
    @PatchMapping("/me")
    public ApiResponse<ProfileUpdateResponseDTO> updateProfile(@ModelAttribute ProfileUpdateRequestDTO dto) throws IOException,InvalidKeySpecException{
        ProfileUpdateResponseDTO response = userService.updateProfile(dto);

        return ApiResponse.onSuccess(response);
    }

    // 홈 프로필 조회
    @GetMapping("profile")
    public ApiResponse<HomeResponseDTO.ProfileDTO> getHomeProfile() throws IOException, InvalidKeySpecException {
        HomeResponseDTO.ProfileDTO response = userService.getHomeProfileByUser();

        return ApiResponse.onSuccess(response);
    }

    // 회원 탈퇴
    @DeleteMapping("/me")
    public ApiResponse<WithdrawResponseDTO> withdraw(@RequestBody @Valid WithdrawRequestDTO dto){
        WithdrawResponseDTO response = userService.withdrawUser(dto);
        return ApiResponse.onSuccess(response);
    }


    // 카카오 로그인
    @GetMapping("/login/kakao")
    public ApiResponse<LoginResponseDTO.KakaoLoginResponse> kakaoLogin(@RequestParam("code") String code, HttpServletResponse response){
        LoginResponseDTO.KakaoLoginResponse loginDto = authService.kakaoLogin(code,response);
        return ApiResponse.onSuccess(loginDto);
    }

    // 카카오 회원가입 온보딩
    @PostMapping("/login/kakao/onboarding")
    public ApiResponse<String> kakaoOnboarding(@Valid @RequestBody OnboardingRequestDTO dto, HttpServletResponse response){
        authService.kakaoOnboarding(dto,response);

        return ApiResponse.onSuccess("Register successfully");
    }
}
