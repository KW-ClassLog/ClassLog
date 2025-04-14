package org.example.backend.domain.user.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend.domain.accountLocal.dto.request.VerifyEmailRequestDTO;
import org.example.backend.domain.user.dto.request.RegisterRequestDTO;
import org.example.backend.domain.accountLocal.dto.response.VerifyEmailResponseDTO;
import org.example.backend.domain.user.service.MailService;
import org.example.backend.domain.user.service.UserService;
import org.example.backend.global.ApiResponse;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final MailService mailService;

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
    public ApiResponse<VerifyEmailResponseDTO> sendEmailCode(@Valid @RequestBody VerifyEmailRequestDTO verifyEmailRequestDTO){
        // 이메일 중복 체크
        userService.validateEmailDuplication(verifyEmailRequestDTO.getEmail());

        // 이메일 인증번호 전송
        int authCode = mailService.sendVerificationCode(verifyEmailRequestDTO.getEmail());

        // 인증번호 전송 로직
        VerifyEmailResponseDTO responseDTO = new VerifyEmailResponseDTO(authCode);
        return ApiResponse.onSuccess(responseDTO);
    }

}
