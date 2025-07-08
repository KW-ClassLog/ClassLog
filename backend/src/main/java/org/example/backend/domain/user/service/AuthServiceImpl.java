package org.example.backend.domain.user.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.backend.domain.user.converter.UserConverter;
import org.example.backend.domain.user.dto.response.LoginResponseDTO;
import org.example.backend.domain.user.entity.SocialType;
import org.example.backend.domain.user.entity.User;
import org.example.backend.domain.user.exception.UserErrorCode;
import org.example.backend.domain.user.exception.UserException;
import org.example.backend.domain.user.repository.UserRepository;
import org.example.backend.global.security.token.JWTUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Optional;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserConverter userConverter;
    private final JWTUtil jwtUtil;
    private final UserRedisService userRedisService;

    @Value("${kakao.key.client-id}")
    private String clientId;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    // 카카오 로그인
    @Override
    public LoginResponseDTO.KakaoLoginResponse kakaoLogin(String code, HttpServletResponse response) {

        String accessToken = getAccessToken(code);
        HashMap<String, Object> userInfo = getKakaoUserInfo(accessToken);
        return kakaoUserLogin(userInfo,response);
    }

    // 인가코드 -> 액세스 토큰 요청
    private String getAccessToken(String code) {

        // HTTP Header
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        // HTTP Body
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("code", code);
        body.add("redirect_uri", redirectUri);
        body.add("client_id", clientId);

        // HTTP 요청 보내기
        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest = new HttpEntity<>(body, headers);
        RestTemplate rt = new RestTemplate();
        ResponseEntity<String> response = rt.exchange(
                "https://kauth.kakao.com/oauth/token",
                HttpMethod.POST,
                kakaoTokenRequest,
                String.class
        );

        // HTTP 응답: 액세스 토큰 파싱
        String responseBody = response.getBody();
        ObjectMapper mapper = new ObjectMapper();
        JsonNode responseJson;

        try{
            responseJson = mapper.readTree(responseBody);
        } catch (JsonProcessingException e){
            e.printStackTrace();
            throw new UserException(UserErrorCode._KAKAO_SERVER_ERROR);
        }
        return responseJson.get("access_token").asText();
    }

    // 액세스 토큰 -> 유저 정보 요청
    private HashMap<String, Object> getKakaoUserInfo(String accessToken) {
        HashMap<String, Object> userInfo = new HashMap<>();

        // HTTP Header
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/json;charset=utf-8");
        headers.add("Authorization", "Bearer " + accessToken);

        // HTTP Body
        HttpEntity<HashMap<String, Object>> kakaoUserInfoRequest = new HttpEntity<>(headers);
        RestTemplate rt = new RestTemplate();
        ResponseEntity<String> response = rt.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.POST,
                kakaoUserInfoRequest,
                String.class
        );

        // 응답 파싱
        String responseBody = response.getBody();
        ObjectMapper mapper = new ObjectMapper();
        JsonNode responseJson;
        try{
            responseJson = mapper.readTree(responseBody);
            Long id = responseJson.get("id").asLong();
            JsonNode kakaoAccount = responseJson.get("kakao_account");
            JsonNode profile = kakaoAccount.get("profile");

            String nickname = profile.get("nickname").asText();
            String email = kakaoAccount.get("email").asText();
            String profileImage = profile.has("profile_image_url")
                    ? profile.get("profile_image_url").asText()
                    : null;

            userInfo.put("id", id);
            userInfo.put("email", email);
            userInfo.put("nickname", nickname);
            userInfo.put("profile_image", profileImage);
            return userInfo;

        } catch (JsonProcessingException e){
            e.printStackTrace();
            throw new UserException(UserErrorCode._KAKAO_SERVER_ERROR);
        }
    }

    // 카카오 ID로 회원가입 & 로그인
    private LoginResponseDTO.KakaoLoginResponse kakaoUserLogin(HashMap<String, Object> userInfo, HttpServletResponse response) {

//        Long id = (Long) userInfo.get("id");
        String nickname = (String) userInfo.get("nickname");
        String email = (String) userInfo.get("email");
        String profileImage = (String) userInfo.get("profile_image");

        // 기존 가입자 화인
        Optional<User> existingAccount = userRepository.findByEmail(email);
        if (existingAccount.isPresent()) {
            User user = existingAccount.get();

            // 자체 가입자일 경우
            if(user.getSocialType() != SocialType.KAKAO){
                throw new UserException(UserErrorCode._EMAIL_ALREADY_EXISTS);
            }

            // 카카오 로그인 로직 수행
            UUID userId = user.getId();
            String role = user.getRole().toString();

            String accessToken = jwtUtil.createAccessToken(userId,role);
            String refreshToken = jwtUtil.createRefreshToken(userId,role);

            // Redis에 refreshToken 저장
            userRedisService.setRefreshToken(userId.toString(),refreshToken);

            // access token 응답 Header
            response.addHeader("Authorization","Bearer "+accessToken);

            // refresh token 응답 Header
            response.addHeader("Set-Cookie","refresh_token="+refreshToken+
                    "; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=" + (14 * 24 * 60 * 60));

            return userConverter.toKakaoLoginResponse();
        }

        // 카카오 회원가입 로직 수행  -> 온보딩
        return userConverter.toKakaoOnboardingResponse(email, nickname, profileImage);
    }
}
