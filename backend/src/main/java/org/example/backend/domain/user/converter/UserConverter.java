package org.example.backend.domain.user.converter;


import lombok.RequiredArgsConstructor;
import org.example.backend.domain.user.dto.request.ProfileUpdateRequestDTO;
import org.example.backend.domain.user.dto.request.RegisterRequestDTO;
import org.example.backend.domain.user.dto.response.ProfileUpdateResponseDTO;
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

    // requestDTO -> Entity
    public User toUser(ProfileUpdateRequestDTO dto, String profileUrl){
        return User.builder()
                .name(dto.getName())
                .organization(dto.getOrganization())
                .phoneNumber(dto.getPhoneNumber())
                .profileUrl(profileUrl)
                .build();
    }
}

