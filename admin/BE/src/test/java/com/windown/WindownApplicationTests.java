package com.windown;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.windown.auth.entity.User;
import com.windown.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class WindownApplicationTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void contextLoads() {
        User admin = userRepository.findByUsername("admin")
                .orElseGet(() -> User.builder()
                        .username("admin")
                        .fullName("Chủ Xưởng")
                        .role(User.Role.OWNER)
                        .isActive(true)
                        .build());
        admin.setPassword(passwordEncoder.encode("admin123"));
        userRepository.save(admin);

        User updatedAdmin = userRepository.findByUsername("admin")
                .orElseThrow(() -> new AssertionError("Admin user should exist"));
        assertTrue(passwordEncoder.matches("admin123", updatedAdmin.getPassword()), "Password 'admin123' should match BCrypt hash after resetting");
    }
}
