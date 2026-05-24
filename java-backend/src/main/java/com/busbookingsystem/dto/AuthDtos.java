package com.busbookingsystem.dto;

import com.busbookingsystem.entity.Role;
import com.busbookingsystem.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDtos {

    private AuthDtos() {
    }

    public record RegisterRequest(
            @NotBlank @Size(min = 2, max = 50) String username,
            @NotBlank @Size(min = 5, max = 20) String contact,
            @NotBlank @Size(min = 6, max = 100) String password
    ) {
    }

    public record LoginRequest(
            @NotBlank String username,
            @NotBlank String password
    ) {
    }

    public record AuthResponse(Long id, String username, String contact, Role role) {
        public static AuthResponse from(User user) {
            return new AuthResponse(user.getId(), user.getUsername(), user.getContact(), user.getRole());
        }
    }

    public record ErrorResponse(String error) {
    }
}
