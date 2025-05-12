package org.example.backend.domain.user.controller;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend.domain.user.dto.request.EmailRequestDTO;
import org.example.backend.domain.user.dto.request.ResetPwdRequestDTO;
import org.example.backend.domain.user.dto.request.RegisterRequestDTO;
import org.example.backend.domain.user.dto.response.EmailResponseDTO;
import org.example.backend.domain.user.dto.response.RefreshTokenResponseDTO;
import org.example.backend.domain.user.exception.UserErrorCode;
import org.example.backend.domain.user.exception.UserException;
import org.example.backend.domain.user.service.MailService;
import org.example.backend.domain.user.service.UserRedisService;
import org.example.backend.domain.user.service.UserService;
import org.example.backend.global.ApiResponse;
import org.example.backend.global.security.token.JWTUtil;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final MailService mailService;
    private final UserRedisService userRedisService;
    private final JWTUtil jwtUtil;

    // 회원가입
    @PostMapping
    public ApiResponse<String> register(@Valid @RequestBody RegisterRequestDTO registerRequestDTO){
        userService.registerUser(registerRequestDTO);
        return ApiResponse.onSuccess("Register successfully");
    }

    // 개인정보조회
    @GetMapping("/me")
    public ApiResponse<String> profile(){
        return ApiResponse.onSuccess("개인정보 조회 성공");
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

        // 토큰 존재 확인
        String refreshToken = userService.extractRefreshToken(request);

        if(refreshToken == null){
            throw new UserException(UserErrorCode._REFRESH_TOKEN_MISSING);
        }

        // 토큰 만료 검증 & 토큰 생성
        RefreshTokenResponseDTO dto = jwtUtil.reissueToken(refreshToken);

        response.setHeader("Authorization","Bearer "+dto.getAccessToken());

        response.addHeader("Set-Cookie","refresh_token=" + dto.getRefreshToken() +
                "; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=" + (14 * 24 * 60 * 60));

        return ApiResponse.onSuccess("리프레시 토큰 발급 성공");
    }

    // 로그아웃
    @PostMapping("/logout")
    public ApiResponse<String> logout(HttpServletRequest request){
        String accessToken = jwtUtil.resolveAccessToken(request);
        String refreshToken = userService.extractRefreshToken(request);

        if(accessToken != null){
            // access token & refresh token 만료 처리
            try{
                System.out.println("access token = " + accessToken);
                long exp = jwtUtil.getExpiration(accessToken);
                userRedisService.setBlackList(accessToken, exp);
            } catch (ExpiredJwtException e){
                System.out.println("access token 만료됨, 블랙리스트 생략");
            } catch (Exception e){
                System.out.println("access token 처리 중 예외 발생");
            }
        }

        if(refreshToken != null){
            try{
                String email = jwtUtil.getEmail(refreshToken);
                userRedisService.deleteRefreshToken(email);
            } catch (Exception e){
                System.out.println("refresh token 만료됨 또는 파싱 실패");
            }
        }

        return ApiResponse.onSuccess("로그아웃 성공");
    }


}
