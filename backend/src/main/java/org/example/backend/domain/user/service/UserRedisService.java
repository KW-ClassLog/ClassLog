package org.example.backend.domain.user.service;

public interface UserRedisService {
    // 임시 비번 저장
    void setTemporaryPassword(String email, String tempPassword, long duration);

    // 임시 비번 삭제
    void deleteTemporaryPassword(String email);

    // 키 네이밍 규칙
    String buildTempPwdKey(String email);

    // 키 존재 여부 확인
    boolean existTemporaryPassword(String email);

    // 토큰 저장
    void setRefreshToken(String email, String refreshToken);

    // 토큰 조회
    String getRefreshToken(String email);

    // 토큰 삭제
    void deleteRefreshToken(String email);

    // 키 네이밍 규칙
    String buildRefreshTokenKey(String email);

    // accessToken 블랙리스트 저장
    void setBlackList(String accessToken, long duration);

    // 블랙리스트에 저장된 토큰인지 검증
    boolean isBlackList(String accessToken);
}
