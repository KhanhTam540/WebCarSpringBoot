package Nhom21.weboto.controller;

import Nhom21.weboto.dto.PasswordRequest;
import Nhom21.weboto.dto.UserDTO;
import Nhom21.weboto.entity.User;
import Nhom21.weboto.service.AuthService;
import Nhom21.weboto.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    // Lấy thông tin cá nhân của người dùng hiện tại
    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getProfile(Principal principal) {
        User user = userService.getByUsername(principal.getName());
        UserDTO dto = new UserDTO();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRoles(user.getRoles().stream().map(r -> r.getName()).collect(Collectors.toSet()));
        return ResponseEntity.ok(dto);
    }

    // Cập nhật email cá nhân (không cần OTP - API cũ)
    @PutMapping("/profile")
    public ResponseEntity<String> updateProfile(Principal principal, @RequestBody UserDTO dto) {
        userService.updateEmail(principal.getName(), dto.getEmail());
        return ResponseEntity.ok("Cập nhật thông tin thành công!");
    }

    // Đổi mật khẩu cá nhân (dùng mật khẩu cũ - API cũ)
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(Principal principal, @RequestBody PasswordRequest request) {
        try {
            userService.changePassword(principal.getName(), request.getOldPassword(), request.getNewPassword());
            return ResponseEntity.ok("Đổi mật khẩu thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // === OTP-VERIFIED PROFILE CHANGE ===

    // Gửi OTP về email để xác thực thay đổi thông tin
    @PostMapping("/send-otp-profile")
    public ResponseEntity<String> sendOtpForProfile(Principal principal) {
        try {
            authService.sendOtpForProfileChange(principal.getName());
            return ResponseEntity.ok("Mã OTP đã được gửi đến email của bạn!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Xác thực OTP và đổi Email mới
    @PostMapping("/verify-change-email")
    public ResponseEntity<String> verifyAndChangeEmail(
            Principal principal,
            @RequestBody Map<String, String> body) {
        try {
            String otpCode = body.get("otpCode");
            String newEmail = body.get("newEmail");
            authService.verifyOtpAndChangeEmail(principal.getName(), otpCode, newEmail);
            return ResponseEntity.ok("Đổi email thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Xác thực OTP và đổi Mật khẩu mới
    @PostMapping("/verify-change-password")
    public ResponseEntity<String> verifyAndChangePassword(
            Principal principal,
            @RequestBody Map<String, String> body) {
        try {
            String otpCode = body.get("otpCode");
            String newPassword = body.get("newPassword");
            authService.verifyOtpAndChangePassword(principal.getName(), otpCode, newPassword);
            return ResponseEntity.ok("Đổi mật khẩu thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
