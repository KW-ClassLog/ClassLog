package org.example.backend.domain.user.service;

import org.example.backend.domain.user.dto.request.RegisterRequestDTO;

public interface UserService {

    //회원가입
    void registerUser(RegisterRequestDTO request);

    // 이메일 중복 체크
    void validateEmailDuplication(String email);

    // 이메일이 존재 여부 확인
    boolean existEmail(String email);

}
