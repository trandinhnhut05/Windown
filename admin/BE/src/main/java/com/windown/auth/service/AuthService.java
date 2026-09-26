package com.windown.auth.service;

import com.windown.auth.dto.AuthResponse;
import com.windown.auth.dto.LoginRequest;
import com.windown.auth.entity.User;
import com.windown.auth.repository.UserRepository;
import com.windown.auth.security.JwtService;
import com.windown.common.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );
        } catch (AuthenticationException e) {
            throw AppException.unauthorized("Tên đăng nhập hoặc mật khẩu không đúng");
        }

        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> AppException.notFound("Không tìm thấy tài khoản"));

        String token = jwtService.generateToken(user);

        return AuthResponse.of(
                token,
                expirationMs / 1000,
                new AuthResponse.UserInfo(user.getId(), user.getUsername(), user.getFullName(), user.getRole().name())
        );
    }
}
