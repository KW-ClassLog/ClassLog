package org.example.backend.domain.user.converter;


import org.example.backend.domain.user.dto.request.RegisterRequestDTO;
import org.example.backend.domain.user.entity.SocialType;
import org.example.backend.domain.user.entity.Status;
import org.example.backend.domain.user.entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class
UserConverter {

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
}

