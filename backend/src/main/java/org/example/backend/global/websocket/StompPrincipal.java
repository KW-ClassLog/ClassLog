package org.example.backend.global.websocket;


import java.security.Principal;
import java.util.UUID;
public record StompPrincipal(UUID userId, String role) implements Principal {
    @Override
    public String getName() {
        return userId.toString();
    }
}