package org.example.backend.domain.user.dto.request;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ProfileUpdateRequestDTO {

    private String name;
    private String organization;
    private String phoneNumber;
    private MultipartFile profile;
}
