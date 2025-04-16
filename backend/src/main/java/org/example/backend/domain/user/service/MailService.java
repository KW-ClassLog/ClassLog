package org.example.backend.domain.user.service;

public interface MailService {

    // 인증번호 전송
    int sendVerificationCode(String email);

    // 임시 비번 발급
    int sendTemporaryPassword(String email);
}
