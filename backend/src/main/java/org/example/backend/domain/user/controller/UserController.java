package org.example.backend.domain.user.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend.domain.accountLocal.dto.request.EmailRequestDTO;
import org.example.backend.domain.user.dto.request.RegisterRequestDTO;
import org.example.backend.domain.accountLocal.dto.response.EmailResponseDTO;
import org.example.backend.domain.user.exception.UserErrorCode;
import org.example.backend.domain.user.exception.UserException;
import org.example.backend.domain.user.service.MailService;
import org.example.backend.domain.user.service.UserRedisService;
import org.example.backend.domain.user.service.UserService;
import org.example.backend.global.ApiResponse;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final MailService mailService;
    private final UserRedisService userRedisService;

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

}
