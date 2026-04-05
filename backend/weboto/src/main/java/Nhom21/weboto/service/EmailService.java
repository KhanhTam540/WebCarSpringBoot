package Nhom21.weboto.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("ngodinhbao04@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Mã xác thực tài khoản Web Phụ Tùng Ô Tô");
        message.setText("Mã OTP của bạn là: " + otpCode + ". Mã có hiệu lực trong 5 phút.");
        mailSender.send(message);
    }
}
