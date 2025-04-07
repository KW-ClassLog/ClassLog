package org.example.backend.domain.user.converter;


import org.example.backend.domain.accountLocal.entity.AccountLocal;
import org.example.backend.domain.accountLocal.repository.AccountLocalRepository;
import org.example.backend.domain.user.dto.request.RegisterRequestDTO;
import org.example.backend.domain.user.entity.User;
import org.example.backend.domain.user.exception.UserErrorCode;
import org.example.backend.domain.user.exception.UserException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserConverter {

    public User toUser(RegisterRequestDTO registerRequestDTO){

        return User.builder()
                .name(registerRequestDTO.getName())
                .role(registerRequestDTO.getRole())
                .phoneNumber(registerRequestDTO.getPhone_number())
                .organization(registerRequestDTO.getOrganization())
                .build();

    }

    public AccountLocal toAccountLocal(RegisterRequestDTO registerRequestDTO, User user, PasswordEncoder passwordEncoder){
        return AccountLocal.builder()
                .email(registerRequestDTO.getEmail())
                .password(passwordEncoder.encode(registerRequestDTO.getPassword()))
                .user(user)
                .build();
    }

}

