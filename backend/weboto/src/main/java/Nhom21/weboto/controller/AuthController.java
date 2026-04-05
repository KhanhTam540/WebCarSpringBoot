package Nhom21.weboto.controller;

import Nhom21.weboto.dto.LoginResponse;
import Nhom21.weboto.dto.RegisterRequest;
import Nhom21.weboto.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * API Đăng ký tài khoản mới 
     * Yêu cầu: Username, Password mạnh, Email [cite: 7, 8, 9, 31]
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        try {
            authService.register(
                request.getUsername(), 
                request.getPassword(), 
                request.getEmail()
            );
            return ResponseEntity.ok("Đăng ký thành công! Vui lòng kiểm tra Email để nhận mã OTP xác thực.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * API Xác thực tài khoản qua mã OTP gửi qua Email [cite: 10, 32]
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam String username, @RequestParam String code) {
        try {
            authService.verifyOtp(username, code);
            return ResponseEntity.ok("Xác thực thành công! Tài khoản của bạn đã được kích hoạt.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * API Đăng nhập hệ thống 
     * Trả về JWT Token để duy trì phiên làm việc 
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        try {
            // AuthService.authenticate giờ đây trả về một chuỗi JWT String 
            String token = authService.authenticate(username, password);
            
            // Trả về Token dưới dạng JSON cho Client
            return ResponseEntity.ok(new LoginResponse(token));
        } catch (RuntimeException e) {
            // Trả về lỗi 401 nếu thông tin đăng nhập sai hoặc chưa kích hoạt 
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}

