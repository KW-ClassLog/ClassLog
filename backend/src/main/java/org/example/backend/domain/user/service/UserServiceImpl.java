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

import java.util.Optional;


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
        Optional<AccountLocal> existingAccount = accountLocalRepository.findByEmail(registerRequestDTO.getEmail());
        if (existingAccount.isPresent()) {
            throw new UserException(UserErrorCode._EMAIL_ALREADY_EXISTS);
        }

        // 엔티티 변환
        User user = userConverter.toUser(registerRequestDTO);
        AccountLocal accountLocal = userConverter.toAccountLocal(registerRequestDTO,user,passwordEncoder);


        // User, AccountLocal 저장
        userRepository.save(user);
        accountLocalRepository.save(accountLocal);
    }

    // 이메일 중복 인증
    @Override
    public void validateEmailDuplication(String email) {

        Optional<AccountLocal> existingAccount = accountLocalRepository.findByEmail(email);
        if (existingAccount.isPresent()) {
            throw new UserException(UserErrorCode._EMAIL_ALREADY_EXISTS);
        }
    }

    // 이메일이 존재 여부 확인 - 임시 비번 발급용
    @Override
    public boolean existEmail(String email) {
        Optional<AccountLocal> existingAccount = accountLocalRepository.findByEmail(email);
        return existingAccount.isPresent();
    }

    // 임시비번 업데이트
    @Override
    public void updateTempPassword(String email, String tempPassword) {
        //  기존 사용자 조회
        AccountLocal accountLocal = accountLocalRepository.findByEmail(email)
                .orElseThrow(() -> new UserException(UserErrorCode._EMAIL_NOT_FOUND));
        System.out.println("[userService]: "+tempPassword);
        // 비밀번호 암호화 후 저장
        String encoded = passwordEncoder.encode(tempPassword);
        accountLocal.setPassword(encoded);

        // 저장
        accountLocalRepository.save(accountLocal);
    }
}
