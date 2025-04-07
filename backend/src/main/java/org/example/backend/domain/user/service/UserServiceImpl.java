package org.example.backend.domain.user.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.accountLocal.entity.AccountLocal;
import org.example.backend.domain.accountLocal.repository.AccountLocalRepository;
import org.example.backend.domain.user.converter.UserConverter;
import org.example.backend.domain.user.exception.UserErrorCode;
import org.example.backend.domain.user.dto.request.RegisterRequestDTO;
import org.example.backend.domain.user.entity.User;
import org.example.backend.domain.user.exception.UserException;
import org.example.backend.domain.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final AccountLocalRepository accountLocalRepository;
    private final UserConverter userConverter;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(
            UserConverter userConverter,
            UserRepository userRepository,
            AccountLocalRepository accountLocalRepository,
            PasswordEncoder passwordEncoder){
        this.accountLocalRepository = accountLocalRepository;
        this.userConverter = userConverter;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    //회원가입
    @Override
    public void registerUser(RegisterRequestDTO registerRequestDTO) {

        // 이메일 중복 인증
        if(accountLocalRepository.existsByEmail(registerRequestDTO.getEmail())){
            throw new UserException(UserErrorCode._EMAIL_ALREADY_EXISTS);
        }

        // 엔티티 변환
        User user = userConverter.toUser(registerRequestDTO);
        AccountLocal accountLocal = userConverter.toAccountLocal(registerRequestDTO,user,passwordEncoder);


        // User, AccountLocal 저장
        userRepository.save(user);
        accountLocalRepository.save(accountLocal);
    }
}
