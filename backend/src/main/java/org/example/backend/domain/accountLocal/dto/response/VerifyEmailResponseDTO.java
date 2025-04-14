package org.example.backend.domain.accountLocal.dto.response;

import lombok.Getter;

@Getter
public class VerifyEmailResponseDTO {
    private int authCode;

    public VerifyEmailResponseDTO(int authCode){
        this.authCode = authCode;
    }
}
