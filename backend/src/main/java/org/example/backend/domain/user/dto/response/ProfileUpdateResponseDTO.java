package org.example.backend.domain.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateResponseDTO {

    private UUID userId;
    private String name;
    private String organization;
    private String phoneNumber;
    private String profile;
}
