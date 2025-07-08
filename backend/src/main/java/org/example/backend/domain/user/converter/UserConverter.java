package org.example.backend.domain.user.converter;


import lombok.RequiredArgsConstructor;
import org.example.backend.domain.user.dto.request.RegisterRequestDTO;
import org.example.backend.domain.user.dto.response.HomeResponseDTO;
import org.example.backend.domain.user.dto.response.LoginResponseDTO;
import org.example.backend.domain.user.dto.response.ProfileUpdateResponseDTO;
import org.example.backend.domain.user.dto.response.UserProfileResponseDTO;
import org.example.backend.domain.user.entity.SocialType;
import org.example.backend.domain.user.entity.Status;
import org.example.backend.domain.user.entity.User;
import org.example.backend.global.S3.service.S3Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class
UserConverter {
    private final S3Service s3Service;

    public User toUser(RegisterRequestDTO registerRequestDTO, PasswordEncoder passwordEncoder){

        return User.builder()
                .name(registerRequestDTO.getName())
                .role(registerRequestDTO.getRole())
                .phoneNumber(registerRequestDTO.getPhoneNumber())
                .organization(registerRequestDTO.getOrganization())
                .email(registerRequestDTO.getEmail())
                .password(passwordEncoder.encode(registerRequestDTO.getPassword()))
                .socialType(SocialType.LOCAL)
                .status(Status.ACTIVE)
                .build();

    }

    // Entity -> responseDTO
    public ProfileUpdateResponseDTO toProfileUpdateResponseDTO(User user){

        return ProfileUpdateResponseDTO.builder()
                .userId(user.getId())
                .name(user.getName())
                .organization(user.getOrganization())
                .phoneNumber(user.getPhoneNumber())
                .profile(s3Service.getPublicUrl(user.getProfileUrl()))
                .build();
    }

    // Entity -> responseDTO
    public UserProfileResponseDTO toUserProfileResponseDTO(User user){
        return UserProfileResponseDTO.builder()
                .userId(user.getId())
                .name(user.getName())
                .organization(user.getOrganization())
                .phoneNumber(user.getPhoneNumber())
                .profile(s3Service.getPublicUrl(user.getProfileUrl()))
                .role(user.getRole().toString())
                .build();
    }

    public HomeResponseDTO.ProfileDTO toProfileDTO(User user){

        return HomeResponseDTO.ProfileDTO.builder()
                .name(user.getName())
                .organization(user.getOrganization())
                .profile(s3Service.getPublicUrl(user.getProfileUrl()))
                .build();
    }

    // 카카오 로그인 온보딩
    public LoginResponseDTO.KakaoLoginResponse toKakaoOnboardingResponse(String email, String name, String profileImage){

        return LoginResponseDTO.KakaoLoginResponse.builder()
                .email(email)
                .name(name)
                .profile(profileImage)
                .onboardingRequired(true)
                .build();
    }

    // 카카오 로그인
    public LoginResponseDTO.KakaoLoginResponse toKakaoLoginResponse(){

        return LoginResponseDTO.KakaoLoginResponse.builder()
                .email(null)
                .name(null)
                .profile(null)
                .onboardingRequired(false)
                .build();
    }
}

