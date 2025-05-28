package org.example.backend.domain.user.converter;


import lombok.RequiredArgsConstructor;
import org.example.backend.domain.user.dto.request.RegisterRequestDTO;
import org.example.backend.domain.user.dto.response.HomeResponseDTO;
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
                .phoneNumber(registerRequestDTO.getPhone_number())
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
        String profileKey = user.getProfileUrl();
        String profileUrl = s3Service.getPublicUrl(
                (profileKey == null || profileKey.isBlank()) ? "profile/default.jpg" : profileKey
        );

        return HomeResponseDTO.ProfileDTO.builder()
                .name(user.getName())
                .organization(user.getOrganization())
                .profile(profileUrl)
                .build();
    }
}

