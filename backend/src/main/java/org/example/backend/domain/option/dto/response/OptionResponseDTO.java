package org.example.backend.domain.option.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class OptionResponseDTO {
    private UUID id;
    private int optionOrder;
    private String text;
}