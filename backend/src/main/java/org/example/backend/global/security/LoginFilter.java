package org.example.backend.global.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.backend.domain.accountLocal.dto.request.LoginDTO;
import org.example.backend.domain.user.service.CustomUserDetails;
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
import java.util.Iterator;

import static org.example.backend.global.code.base.FailureCode._UNAUTHORIZED;

public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;

    public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil){
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }


    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        LoginDTO loginDTO;
        try{

            ObjectMapper objectMapper = new ObjectMapper();
            ServletInputStream inputStream = request.getInputStream();
            String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
            loginDTO = objectMapper.readValue(messageBody, LoginDTO.class);

        }catch(IOException e){
            throw new AuthenticationServiceException("로그인 요청 형식을 읽을 수 없음",e);
        }
        // 클라이언트 요청에서 username, password 추출
        String email = loginDTO.getEmail();
        String password = loginDTO.getPassword();

        // username과 password를 검증하기 위해서 token에 담아야함
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(email, password, null);

        //token에 담은 검증을 위한 AuthenticationManager로 전달
        return authenticationManager.authenticate(authToken);
    }

    //로그인 성공시 실행(여기서 JWT 토큰 발급)
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException {
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

        String email = customUserDetails.getUsername();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends  GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();

        String role = auth.getAuthority();

        String token = jwtUtil.createJwt(email,role,60*60*10L);

        // 응답 Header
        response.addHeader("Authorization","Bearer"+token);
        System.out.println(token);

        // 응답 body
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        ApiResponse<String> apiResponse = ApiResponse.onSuccess("Login successfully");
        String json = new ObjectMapper().writeValueAsString(apiResponse);

        response.getWriter().write(json);

    }

    // 로그인 실패시 실행
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException{

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // 실패시 401 응답코드
        ApiResponse <Object> apiResponse = ApiResponse.onFailure(_UNAUTHORIZED);
        String json = new ObjectMapper().writeValueAsString(apiResponse);

        response.getWriter().write(json);
    }
}
