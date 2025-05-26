package org.example.backend.domain.classroom.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class EntryCodeResponseDTO {
    private UUID class_id;
    private String entry_code;
    private String expires_at;
}