package Nhom21.weboto.service;

import Nhom21.weboto.entity.*;
import Nhom21.weboto.repository.*;
import Nhom21.weboto.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private OtpVerificationRepository otpRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Transactional
    public void register(String username, String rawPassword, String email) {
        if (username == null || username.trim().isEmpty()) {
            throw new RuntimeException("Tên đăng nhập không được để trống!");
        }
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email đã được sử dụng!");
        }
        
        // Mật khẩu chứa : chữ in hoa, chữ thường, kí tự đặc biệt và số, ít nhất 8 kí tự
        String passwordPattern = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!_]).{8,}$";
        if (rawPassword == null || !rawPassword.matches(passwordPattern)) {
            throw new RuntimeException("Mật khẩu yếu: Cần có ít nhất 8 ký tự gồm chữ hoa, chữ thường, số và ký tự đặc biệt.");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setIsActive(false);

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy quyền USER."));
        user.setRoles(Collections.singleton(userRole));

        userRepository.save(user);

        String otpCode = String.format("%06d", new Random().nextInt(999999));
        OtpVerification otp = new OtpVerification();
        otp.setOtpCode(otpCode);
        otp.setUser(user);
        otp.setExpiredAt(LocalDateTime.now().plusMinutes(5));
        otpRepository.save(otp);

        emailService.sendOtpEmail(email, otpCode);
    }

    @Transactional
    public void verifyOtp(String username, String code) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        OtpVerification otp = otpRepository.findByOtpCodeAndUser(code, user)
                .orElseThrow(() -> new RuntimeException("Mã OTP không chính xác"));

        if (otp.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Mã OTP đã hết hạn.");
        }

        user.setIsActive(true);
        userRepository.save(user);
        otpRepository.delete(otp);
    }

    public String authenticate(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));

        if (!user.getIsActive()) {
            throw new RuntimeException("Tài khoản chưa được kích hoạt qua OTP hoặc đã bị vô hiệu hóa.");
        }

        if (passwordEncoder.matches(password, user.getPassword())) {
            return tokenProvider.generateToken(username);
        } else {
            throw new RuntimeException("Sai tên đăng nhập hoặc mật khẩu");
        }
    }

    // Gửi OTP xác thực khi muốn đổi email hoặc mật khẩu
    @Transactional
    public void sendOtpForProfileChange(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));
        
        // Xóa OTP cũ nếu có
        otpRepository.deleteByUser(user);
        
        String otpCode = String.format("%06d", new Random().nextInt(999999));
        OtpVerification otp = new OtpVerification();
        otp.setOtpCode(otpCode);
        otp.setUser(user);
        otp.setExpiredAt(LocalDateTime.now().plusMinutes(5));
        otpRepository.save(otp);
        
        emailService.sendOtpEmail(user.getEmail(), otpCode);
    }

    // Xác thực OTP và đổi email
    @Transactional
    public void verifyOtpAndChangeEmail(String username, String code, String newEmail) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));
        
        if (userRepository.existsByEmail(newEmail)) {
            throw new RuntimeException("Email này đã được sử dụng bởi tài khoản khác!");
        }
        
        OtpVerification otp = otpRepository.findByOtpCodeAndUser(code, user)
                .orElseThrow(() -> new RuntimeException("Mã OTP không chính xác"));
        
        if (otp.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Mã OTP đã hết hạn.");
        }
        
        user.setEmail(newEmail);
        userRepository.save(user);
        otpRepository.delete(otp);
    }

    // Xác thực OTP và đổi mật khẩu mới (không cần mật khẩu cũ)
    @Transactional
    public void verifyOtpAndChangePassword(String username, String code, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));
        
        OtpVerification otp = otpRepository.findByOtpCodeAndUser(code, user)
                .orElseThrow(() -> new RuntimeException("Mã OTP không chính xác"));
        
        if (otp.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Mã OTP đã hết hạn.");
        }
        
        // Kiểm tra độ mạnh mật khẩu mới
        String passwordPattern = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!_]).{8,}$";
        if (!newPassword.matches(passwordPattern)) {
            throw new RuntimeException("Mật khẩu yếu: Cần ít nhất 8 ký tự gồm chữ hoa, chữ thường, số và ký tự đặc biệt.");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        otpRepository.delete(otp);
    }
}