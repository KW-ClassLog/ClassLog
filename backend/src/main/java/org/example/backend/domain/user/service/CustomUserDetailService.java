package org.example.backend.domain.user.service;

import org.example.backend.domain.accountLocal.entity.AccountLocal;
import org.example.backend.domain.accountLocal.repository.AccountLocalRepository;
import org.example.backend.domain.user.entity.User;
import org.example.backend.domain.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;
    private final AccountLocalRepository accountLocalRepository;

    @Autowired
    public CustomUserDetailService(UserRepository userRepository, AccountLocalRepository accountLocalRepository){
        this.userRepository = userRepository;
        this.accountLocalRepository = accountLocalRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        //DB 조회
        // Optional에서 값 추출: get() 또는 orElseThrow 사용
        AccountLocal accountLocal = accountLocalRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Account with email " + email + " not found"));


        if(accountLocal!=null){


            User user = accountLocal.getUser();  // AccountLocal에서 User를 가져옴

            // CustomUserDetails 생성 후 반환
            return new CustomUserDetails(user, accountLocal);
        }
        return null;
    }
}
