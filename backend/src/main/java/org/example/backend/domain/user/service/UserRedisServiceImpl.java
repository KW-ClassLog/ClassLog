package org.example.backend.domain.user.service;

import org.example.backend.global.security.JWTProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class UserRedisServiceImpl implements UserRedisService{

    private final StringRedisTemplate redisTemplate;
    private final JWTProperties jwtProperties;

    @Autowired
    public UserRedisServiceImpl(StringRedisTemplate redisTemplate, JWTProperties jwtProperties){
        this.redisTemplate = redisTemplate;
        this.jwtProperties = jwtProperties;
    }

    // 임시 비밀번호 저장
    @Override
    public void setTemporaryPassword(String email, String tempPassword, long duration) {
        String key = buildTempPwdKey(email);
        redisTemplate.opsForValue().set(key, tempPassword, Duration.ofSeconds(duration));
    }

    // 임시 비밀빈호 삭제
    @Override
    public void deleteTemporaryPassword(String email) {
        redisTemplate.delete(buildTempPwdKey(email));
    }

    // 키 네이밍 규칙
    @Override
    public String buildTempPwdKey(String email) {
        return "tempPwd:" + email;
    }

    // 키 존재 여부 확인
    @Override
    public boolean existTemporaryPassword(String email) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(buildTempPwdKey(email)));
    }

    // 리프레시 토큰 저장
    @Override
    public void setRefreshToken(String userId, String refreshToken) {
        long duration = jwtProperties.getRefreshTokenRedisExpiration();
        String key = buildRefreshTokenKey(userId);
        redisTemplate.opsForValue().set(key, refreshToken, Duration.ofSeconds(duration));
    }

    // 리프레시 토큰 조회
    @Override
    public String getRefreshToken(String userId) {
        return redisTemplate.opsForValue().get(buildRefreshTokenKey(userId));
    }

    // 리프레시 토큰 삭제
    @Override
    public void deleteRefreshToken(String userId) {
        redisTemplate.delete(buildRefreshTokenKey(userId));
    }

    // 키 네이밍 규칙
    @Override
    public String buildRefreshTokenKey(String userId) {
        return "refreshToken:"+ userId;
    }

    // access token 블랙리스트 저장
    @Override
    public void setBlackList(String accessToken, long duration) {
        redisTemplate.opsForValue().set("blacklist:" + accessToken,"logout",Duration.ofMillis(duration));
    }

    // 블랙리스트에 등록된 회원인지 검증
    @Override
    public boolean isBlackList(String accessToken) {
        return Boolean.TRUE.equals(redisTemplate.hasKey("blacklist:" + accessToken));
    }
}
