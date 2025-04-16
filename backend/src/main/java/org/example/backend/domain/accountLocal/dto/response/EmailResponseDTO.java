package org.example.backend.domain.accountLocal.dto.response;

import lombok.Getter;

@Getter
public class EmailResponseDTO {
    private int authCode;

    public EmailResponseDTO(int authCode){
        this.authCode = authCode;
    }
}
