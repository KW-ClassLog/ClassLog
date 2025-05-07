package org.example.backend.domain.user.dto.response;

import lombok.Data;

@Data
public class RefreshTokenResponseDTO {

    private String accessToken;
    private String refreshToken;

    public RefreshTokenResponseDTO(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}
