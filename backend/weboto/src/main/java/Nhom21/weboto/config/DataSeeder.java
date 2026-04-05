package Nhom21.weboto.config;

import Nhom21.weboto.entity.Role;
import Nhom21.weboto.entity.User;
import Nhom21.weboto.repository.RoleRepository;
import Nhom21.weboto.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashSet;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Tạo các Role nếu chưa tồn tại
        if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
            roleRepository.save(new Role(null, "ROLE_ADMIN"));
        }
        if (roleRepository.findByName("ROLE_USER").isEmpty()) {
            roleRepository.save(new Role(null, "ROLE_USER"));
        }

        // 2. Tạo hoặc chuẩn hóa tài khoản Admin mặc định theo username/email để tránh seed lặp
        Role adminRole = roleRepository.findByName("ROLE_ADMIN").get();
        User admin = userRepository.findByUsername("admin")
                .or(() -> userRepository.findByEmail("admin@weboto.com"))
                .orElseGet(User::new);

        boolean isNewAdmin = admin.getId() == null;

        admin.setUsername("admin");
        admin.setEmail("admin@weboto.com");
        admin.setPassword(passwordEncoder.encode("Admin123@")); // Mật khẩu mặc định
        admin.setIsActive(true);
        admin.setRoles(new HashSet<>(Collections.singletonList(adminRole)));

        userRepository.save(admin);

        if (isNewAdmin) {
            System.out.println(">>> Đã tạo tài khoản Admin mặc định: admin/Admin123@");
        } else {
            System.out.println(">>> Đã chuẩn hóa tài khoản Admin mặc định: admin/Admin123@");
        }
    }
}
