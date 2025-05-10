package org.example.backend.domain.user.dto.request;

import lombok.Data;

@Data
public class LoginDTO {
    private String email;

    private String password;
}

