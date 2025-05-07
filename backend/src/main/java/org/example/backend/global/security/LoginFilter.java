package org.example.backend.global.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.backend.domain.accountLocal.dto.request.LoginDTO;
import org.example.backend.domain.user.service.CustomUserDetails;
import org.example.backend.domain.user.service.UserRedisService;
import org.example.backend.global.ApiResponse;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.core.AuthenticationException;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;


public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private final UserRedisService userRedisService;

    public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil, UserRedisService userRedisService){
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRedisService = userRedisService;
    }


    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        LoginDTO loginDTO;
        try{
            ObjectMapper objectMapper = new ObjectMapper();
            ServletInputStream inputStream = request.getInputStream();
            String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
            loginDTO = objectMapper.readValue(messageBody, LoginDTO.class);

            // 클라이언트 요청에서 username, password 추출
            String email = loginDTO.getEmail();
            String password = loginDTO.getPassword();

            // 임시 비번 로그인 여부 판단
            boolean isTemporary = userRedisService.existTemporaryPassword(email);
            request.setAttribute("isTemporaryLogin", isTemporary);

            // 임시 비번으로 로그인했다면 임시비번 삭제
            if(isTemporary){
                userRedisService.deleteTemporaryPassword(email);
            }

            // username과 password를 검증하기 위해서 token에 담아야함
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(email, password, null);

            //token에 담은 검증을 위한 AuthenticationManager로 전달
            return authenticationManager.authenticate(authToken);
        } catch(IOException e){
            throw new AuthenticationServiceException("로그인 요청 형식을 읽을 수 없음",e);
        }

    }

    //로그인 성공시 실행(여기서 JWT 토큰 발급)
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException{
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

        String email = customUserDetails.getEmail();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends  GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String name = customUserDetails.getUsername();
        String role = auth.getAuthority();

        // access Token
        String accessToken = jwtUtil.createAccessToken(email, name, role);

        // refresh Token
        String refreshToken = jwtUtil.createRefreshToken(email);

        // Redis에 refreshToken 저장
        userRedisService.setRefreshToken(email,refreshToken);

        // access token 응답 Header
        response.addHeader("Authorization","Bearer "+accessToken);

        // refresh token 응답 Header
        response.addHeader("Set-Cookie","refresh_token="+refreshToken+
                "; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=" + (14 * 24 * 60 * 60));

        // 응답 body
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        boolean isTemporary = Boolean.TRUE.equals(request.getAttribute("isTemporaryLogin"));

        Map<String, Object> result = new HashMap<>();
        result.put("message", "Login successfully");
        result.put("isTemporary", isTemporary);

        String json = new ObjectMapper().writeValueAsString(ApiResponse.onSuccess(result));

        response.getWriter().write(json);
    }

    // 실패시 실행 (FilterExceptionHandler에 위임)
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException {

        throw failed;
    }
}
