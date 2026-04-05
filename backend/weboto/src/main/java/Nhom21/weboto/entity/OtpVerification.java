package Nhom21.weboto.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "otp_verifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OtpVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // [cite: 115]

    @Column(name = "otp_code", nullable = false, length = 10)
    private String otpCode; // [cite: 117]

    @Column(name = "expired_at", nullable = false)
    private LocalDateTime expiredAt; // 

    // Thiết lập quan hệ: Mỗi mã OTP thuộc về một người dùng cụ thể 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
