package org.example.backend.global.redis;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class RedisService {

    private final StringRedisTemplate redisTemplate;

    @Autowired
    public RedisService(StringRedisTemplate redisTemplate){
        this.redisTemplate = redisTemplate;
    }

    // ket 값에 해당하는 데이터 조회
    public String getData(String key){
        ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();
        return valueOperations.get(key);
    }

    // redis에 저장한 key가 존재하는지 확인
    public boolean existData(String key){
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    // 지정한 key에 value를 저장 주어진 duration 이후에 자동으로 만료되도록
    public void setDataExpire(String key, String value, long duration){
        ValueOperations<String,String> valueOperations = redisTemplate.opsForValue();
        Duration expireDuration = Duration.ofSeconds(duration);
        valueOperations.set(key,value,expireDuration);
    }

    // redis에 지정한 key 삭제
    public void deleteDate(String key){
        redisTemplate.delete(key);
    }
}
