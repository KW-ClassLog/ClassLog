package org.example.backend.domain.user.service;

public interface UserRedisService {
    // 임시 비번 저장
    void setTemporaryPassword(String email, String tempPassword, long duration);

    // 임시 비번 조회
    String getTemporaryPassword(String email);

    // 임시 비번 삭제
    void deleteTemporaryPassword(String email);

    // 키 네이밍 규칙
    String buildTempPwdKey(String email);
}
