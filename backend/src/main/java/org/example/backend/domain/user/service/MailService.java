package org.example.backend.domain.user.service;

public interface MailService {

    // 인증번호 전송
    int sendVerificationCode(String email);
}
