package com.titkul.lms.controller;

import com.titkul.lms.dto.JwtResponse;
import com.titkul.lms.dto.LoginRequest;
import com.titkul.lms.security.JwtUtils;
import com.titkul.lms.security.UserDetailsImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final com.titkul.lms.repository.UserRepository userRepository;
    private final com.titkul.lms.service.OtpService otpService;
    private final com.titkul.lms.service.EmailService emailService;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Value("${jwt.expiration}")
    private Long jwtExpirationMs;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Tài khoản hoặc mật khẩu không chính xác."));
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().stream().findFirst().get().getAuthority().replace("ROLE_", "");

        JwtResponse.UserDto userDto = new JwtResponse.UserDto(
                userDetails.getId(),
                role,
                "ACTIVE", // We would fetch real status if needed
                userDetails.getUsername(),
                userDetails.getRequirePasswordChange()
        );

        return ResponseEntity.ok(new JwtResponse(jwt, "Bearer", jwtExpirationMs / 1000, userDto));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody com.titkul.lms.dto.ForgotPasswordRequest request) {
        java.util.Optional<com.titkul.lms.entity.User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Email không tồn tại trong hệ thống."));
        }

        String otp = otpService.generateOtp(request.getEmail());
        emailService.sendSimpleEmail(
                request.getEmail(),
                "Titkul LMS - Mã xác nhận lấy lại mật khẩu",
                "Mã OTP của bạn là: " + otp + "\n\nMã này có hiệu lực trong 5 phút.\nVui lòng không chia sẻ mã này cho bất kỳ ai."
        );

        return ResponseEntity.ok(java.util.Map.of("message", "Mã OTP đã được gửi đến email của bạn."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody com.titkul.lms.dto.ResetPasswordRequest request) {
        boolean isValid = otpService.validateOtp(request.getEmail(), request.getOtp());
        if (!isValid) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Mã OTP không hợp lệ hoặc đã hết hạn."));
        }

        java.util.Optional<com.titkul.lms.entity.User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            com.titkul.lms.entity.User user = userOpt.get();
            user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);
            return ResponseEntity.ok(java.util.Map.of("message", "Đổi mật khẩu thành công. Bạn có thể đăng nhập ngay bây giờ."));
        }

        return ResponseEntity.badRequest().body(java.util.Map.of("message", "Lỗi không xác định."));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody com.titkul.lms.dto.ChangePasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập."));
        }

        String username = authentication.getName();
        java.util.Optional<com.titkul.lms.entity.User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isPresent()) {
            com.titkul.lms.entity.User user = userOpt.get();
            
            // Allow changing password without checking old password if requirePasswordChange is true
//            if (!user.getRequirePasswordChange()) {
//                if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
//                    return ResponseEntity.badRequest().body(java.util.Map.of("message", "Mật khẩu cũ không chính xác."));
//                }
//            }
//
            user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
            user.setRequirePasswordChange(false);
            userRepository.save(user);
            return ResponseEntity.ok(java.util.Map.of("message", "Đổi mật khẩu thành công."));
        }

        return ResponseEntity.badRequest().body(java.util.Map.of("message", "Người dùng không tồn tại."));
    }
}
