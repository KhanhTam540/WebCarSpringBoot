package Nhom21.weboto.security;

import Nhom21.weboto.entity.User;
import Nhom21.weboto.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    // 1. Tìm user từ thực thể của bạn trong DB
    User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng: " + username));

    // 2. Kiểm tra tài khoản đã kích hoạt chưa 
    if (user.getIsActive() == null || !user.getIsActive()) {
        throw new RuntimeException("Tài khoản chưa được kích hoạt qua OTP");
    }

    // 3. QUAN TRỌNG: Trả về trực tiếp đối tượng user của bạn
    // (Đảm bảo lớp Nhom21.weboto.entity.User đã implements UserDetails như mình hướng dẫn trước đó)
    return user; 
}
}