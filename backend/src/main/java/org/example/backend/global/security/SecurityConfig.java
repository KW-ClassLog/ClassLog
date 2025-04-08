package org.example.backend.global.security;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
@Configuration
public class SecurityConfig {

    private final AuthenticationConfiguration authenticationConfiguration;
    private final JWTUtil jwtUtil;

    public SecurityConfig(AuthenticationConfiguration authenticationConfiguration, JWTUtil jwtUtil){
        this.authenticationConfiguration = authenticationConfiguration;
        this.jwtUtil = jwtUtil;
    }

    //AuthenticationManger Bean 등록
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception
    {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder getPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        // csrf disable
        http
                .csrf((auth)->auth.disable());
        //Form 로그인 방식 disable
        http
                .formLogin((auth)->auth.disable());
        // http basic 인증방식 disable
        http
                .httpBasic((auth)-> auth.disable());
        // 경로별 인가 작업
        http
                .authorizeHttpRequests((auth)->auth
                        .requestMatchers("/api/users","/","/api/users/login").permitAll()
                        .anyRequest().authenticated());
        // custom한 jwtfilter 추가
        http
                .addFilterBefore(new JWTFilter(jwtUtil),LoginFilter.class);
        // custom한 login필터 추가
        LoginFilter loginFilter = new LoginFilter(authenticationManager(authenticationConfiguration),jwtUtil);
        loginFilter.setFilterProcessesUrl("/api/users/login");
        http
                .addFilterAt(loginFilter, UsernamePasswordAuthenticationFilter.class);
        // 세션설정
        http
                .sessionManagement((session)->session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }
}
