package Nhom21.weboto.service;

import Nhom21.weboto.entity.User;
import Nhom21.weboto.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User getByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
    }

    public void updateEmail(String username, String newEmail) {
        User user = getByUsername(username);
        user.setEmail(newEmail);
        userRepository.save(user);
    }

    public void changePassword(String username, String oldPwd, String newPwd) {
        User user = getByUsername(username);
        
        // Kiểm tra mật khẩu cũ có khớp không
        if (!passwordEncoder.matches(oldPwd, user.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không chính xác");
        }
        
        // Mã hóa và lưu mật khẩu mới
        user.setPassword(passwordEncoder.encode(newPwd));
        userRepository.save(user);
    }
}
