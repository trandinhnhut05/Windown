package com.windown.auth.dto;

public record AuthResponse(
        String accessToken,
        String tokenType,
        long expiresIn,
        UserInfo user
) {
    public record UserInfo(Long id, String username, String fullName, String role) {}

    public static AuthResponse of(String token, long expiresIn, UserInfo user) {
        return new AuthResponse(token, "Bearer", expiresIn, user);
    }
}
