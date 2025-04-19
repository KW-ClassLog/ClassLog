package org.example.backend.domain.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class UserRedisServiceImpl implements UserRedisService{

    private final StringRedisTemplate redisTemplate;

    @Autowired
    public UserRedisServiceImpl(StringRedisTemplate redisTemplate){
        this.redisTemplate = redisTemplate;
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
}
