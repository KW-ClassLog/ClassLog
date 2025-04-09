package org.example.backend.domain.accountLocal.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class LoginDTO {
    private String email;

    private String password;
}

