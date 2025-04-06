package org.example.backend.domain.user.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.accountLocal.entity.AccountLocal;
import org.example.backend.domain.accountLocal.repository.AccountLocalRepository;
import org.example.backend.domain.user.UserErrorCode;
import org.example.backend.domain.user.dto.request.UserRegisterDTO;
import org.example.backend.domain.user.entity.User;
import org.example.backend.domain.user.repository.UserRepository;
import org.example.backend.global.code.base.FailureCode;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final AccountLocalRepository accountLocalRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    //회원가입
    @Override
    public void registerUser(UserRegisterDTO request) {

        //이메일 중복 체크
        if(accountLocalRepository.existsByEmail(request.getEmail())){
            throw new ResponseStatusException(
                    FailureCode._BAD_REQUEST.getReasonHttpStatus().getHttpStatus(),
                    FailureCode._BAD_REQUEST.getReasonHttpStatus().getMessage()
            );
        }

        //user 생성
        User user = User.builder()
                .name(request.getName())
                .organization(request.getOrganization())
                .role(request.getRole())
                .phoneNumber(request.getPhone_number())
                .build();

        user = userRepository.save(user); //uuid 반환

        //account local 생성
        AccountLocal account = AccountLocal.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .user(user)
                .build();

        accountLocalRepository.save(account);


    }
}
