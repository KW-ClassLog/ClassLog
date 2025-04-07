package org.example.backend.domain.user.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend.domain.user.dto.request.RegisterRequestDTO;
import org.example.backend.domain.user.service.UserService;
import org.example.backend.global.ApiResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    // 회원가입
    @PostMapping
    public ApiResponse<String> register(@Valid @RequestBody RegisterRequestDTO registerRequestDTO){
        userService.registerUser(registerRequestDTO);
        return ApiResponse.onSuccess("Register successfully");
    }

}
