package org.example.backend.domain.user.dto.response;

import lombok.*;


public class LoginResponseDTO {

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class KakaoLoginResponse {
        private String email;
        private String name;
        private String profile;
        private boolean onboardingRequired;
    }


}
