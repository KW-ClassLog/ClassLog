package org.example.backend.domain.user.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.global.redis.RedisUtil;
import org.example.backend.global.security.token.JWTProperties;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class UserRedisServiceImpl implements UserRedisService{

    private final JWTProperties jwtProperties;
    private final RedisUtil redisUtil;

    // 임시 비밀번호 저장
    @Override
    public void setTemporaryPassword(String email, String tempPassword, long duration) {
        String key = buildTempPwdKey(email);
        redisUtil.set(key, tempPassword, Duration.ofSeconds(duration));
    }

    // 임시 비밀빈호 삭제
    @Override
    public void deleteTemporaryPassword(String email) {
        redisUtil.delete(buildTempPwdKey(email));
    }

    // 키 네이밍 규칙
    @Override
    public String buildTempPwdKey(String email) {
        return "tempPwd:" + email;
    }

    // 키 존재 여부 확인
    @Override
    public boolean existTemporaryPassword(String email) {
        return redisUtil.exists(buildTempPwdKey(email));
    }

    // 리프레시 토큰 저장
    @Override
    public void setRefreshToken(String userId, String refreshToken) {
        long duration = jwtProperties.getRefreshTokenRedisExpiration();
        String key = buildRefreshTokenKey(userId);
        redisUtil.set(key, refreshToken, Duration.ofSeconds(duration));
    }

    // 리프레시 토큰 조회
    @Override
    public String getRefreshToken(String userId) {
        return redisUtil.get(buildRefreshTokenKey(userId));
    }

    // 리프레시 토큰 삭제
    @Override
    public void deleteRefreshToken(String userId) {
        redisUtil.delete(buildRefreshTokenKey(userId));
    }

    // 키 네이밍 규칙
    @Override
    public String buildRefreshTokenKey(String userId) {
        return "refreshToken:"+ userId;
    }

    // access token 블랙리스트 저장
    @Override
    public void setBlackList(String accessToken, long duration) {
        redisUtil.set("blacklist:" + accessToken, "logout", Duration.ofMillis(duration));
    }

    // 블랙리스트에 등록된 회원인지 검증
    @Override
    public boolean isBlackList(String accessToken) {
        return redisUtil.exists("blacklist:" + accessToken);
    }
}
