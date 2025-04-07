package org.example.backend.domain.user.service;

import org.example.backend.domain.user.dto.request.RegisterRequestDTO;

public interface UserService {

    //회원가입
    void registerUser(RegisterRequestDTO request);
}
