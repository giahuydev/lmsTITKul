package com.titkul.lms.service;

import com.titkul.lms.entity.LoginSession;
import com.titkul.lms.entity.User;
import com.titkul.lms.repository.LoginSessionRepository;
import com.titkul.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    @Value("${jwt.refreshExpirationMs:2592000000}")
    private Long refreshTokenDurationMs;

    private final LoginSessionRepository loginSessionRepository;
    private final UserRepository userRepository;

    public LoginSession createRefreshToken(Long userId, String deviceName, String ipAddress) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        
        LoginSession session = LoginSession.builder()
                .user(user)
                .refreshToken(UUID.randomUUID().toString())
                .deviceName(deviceName)
                .ipAddress(ipAddress)
                .expiresAt(LocalDateTime.now().plusNanos(refreshTokenDurationMs * 1_000_000))
                .createdAt(LocalDateTime.now())
                .revoked(false)
                .build();
                
        return loginSessionRepository.save(session);
    }

    public Optional<LoginSession> findByToken(String token) {
        return loginSessionRepository.findAll().stream().filter(s -> s.getRefreshToken().equals(token)).findFirst(); // In real app, query DB directly
    }

    public LoginSession verifyExpiration(LoginSession token) {
        if (token.getExpiresAt().isBefore(LocalDateTime.now()) || token.getRevoked()) {
            loginSessionRepository.delete(token);
            throw new RuntimeException("Refresh token was expired or revoked. Please make a new signin request");
        }
        
        token.setLastUsedAt(LocalDateTime.now());
        return loginSessionRepository.save(token);
    }
}
