package org.example.backend.global.security;

import lombok.Getter;
import org.springframework.stereotype.Component;

@Getter
@Component
public class JWTProperties {

    // access token 만료 시간: 2시간
    //private final long accessTokenExpiration = 2 * 60 * 60 * 1000L;

    // acess token 만료 시간 test: 30초
    private final long accessTokenExpiration = 30 * 1000L;

    // refresh token 만료 시간: 2주
    private final long refreshTokenExpiration = 14 * 24 * 60 * 60 * 1000L;

    // Redis refresh token 저장 시간: 2주
    private final long refreshTokenRedisExpiration = 14 * 24 * 60 * 60L;
}
