package org.example.backend.domain.option.dto.response;

import java.util.UUID;

public static class OptionResponseDTO {
    private UUID id;
    private int optionOrder;
    private String text;

    public OptionResponseDTO(UUID id, int optionOrder, String text) {
        this.id = id;
        this.optionOrder = optionOrder;
        this.text = text;
    }

    public UUID getId() {
        return id;
    }

    public int getOptionOrder() {
        return optionOrder;
    }

    public String getText() {
        return text;
    }
}
}
