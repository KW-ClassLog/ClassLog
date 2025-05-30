package org.example.backend.global.security.token;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletRequest;
import org.example.backend.domain.user.dto.response.RefreshTokenResponseDTO;
import org.example.backend.domain.user.exception.UserErrorCode;
import org.example.backend.domain.user.exception.UserException;
import org.example.backend.domain.user.service.UserRedisService;
import org.example.backend.global.security.auth.CustomUserDetailService;
import org.example.backend.global.security.auth.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

@Component
public class JWTUtil {

    private final SecretKey secretKey;
    private final UserRedisService userRedisService;
    private final CustomUserDetailService customUserDetailService;
    private final JWTProperties jwtProperties;

    @Autowired
    public JWTUtil(@Value("${spring.jwt.secret}") String secret, UserRedisService userRedisService, CustomUserDetailService customUserDetailService, JWTProperties jwtProperties) {

        secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
        this.userRedisService = userRedisService;
        this.customUserDetailService = customUserDetailService;
        this.jwtProperties = jwtProperties;
    }

    public String getEmail(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("email", String.class);
    }

    public String getName(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("name", String.class);
    }

    public String getRole(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("role", String.class);
    }

    public Boolean isExpired(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getExpiration().before(new Date());
    }

    public long getExpiration(String token){
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getExpiration().getTime()-System.currentTimeMillis();
    }

    public UUID getUserId(String token){
        return UUID.fromString(Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("userId", String.class));
    }

    // access token 발급
    public String createAccessToken(UUID userId, String role) {
        long expiredMs = jwtProperties.getAccessTokenExpiration();

        return Jwts.builder()
                .claim("userId",userId.toString())
                .claim("role", role)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiredMs))
                .signWith(secretKey)
                .compact();
    }

    // refreshToken 발급
    public String createRefreshToken(UUID userId, String role){
        long expiredMs = jwtProperties.getRefreshTokenExpiration();
        return Jwts.builder()
                .claim("userId",userId.toString())
                .claim("role", role)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiredMs))
                .signWith(secretKey)
                .compact();
    }

    // refreshToken 검증
    public void validateRefreshToken(String refreshToken){

        try{
            // redis에 저장된 토큰과 일치하는지 확인
            UUID userId = getUserId(refreshToken);
            String redisToken = userRedisService.getRefreshToken(userId.toString());

            if(redisToken == null || !redisToken.equals(refreshToken)){
                System.out.println("refresh token != redis token");
                throw new UserException(UserErrorCode._REFRESH_TOKEN_EXPIRED);
            }
        } catch (ExpiredJwtException e){
            throw new UserException(UserErrorCode._REFRESH_TOKEN_EXPIRED);
        }

    }

    // 새 accessToken & refreshToken 발급
    public RefreshTokenResponseDTO reissueToken(String refreshToken){
        // refresh token 유효성 검사
        validateRefreshToken(refreshToken);

        // 새로운 토큰 발급
        UUID userId = getUserId(refreshToken);

        CustomUserDetails customUserDetails = (CustomUserDetails) customUserDetailService.loadUserByUserId(userId);

        String role = customUserDetails.getAuthorities().iterator().next().getAuthority();

        String newAccessToken = createAccessToken(userId, role);
        String newRefreshToken = createRefreshToken(userId, role);

        // redis 갱신
        userRedisService.setRefreshToken(userId.toString(),newRefreshToken);


        // 응답 반환
        return new RefreshTokenResponseDTO(newAccessToken,newRefreshToken);

    }

    // access token 추출
    public String resolveAccessToken(HttpServletRequest request){
        String token = request.getHeader("Authorization");
        if(token != null && token.startsWith("Bearer ")){
            return token.substring(7);
        }
        return null;
    }
}
