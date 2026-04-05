package Nhom21.weboto.service;

import Nhom21.weboto.dto.AdminUserDTO;
import Nhom21.weboto.entity.User;
import Nhom21.weboto.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminUserService {

    @Autowired
    private UserRepository userRepository;

    // Lấy danh sách toàn bộ người dùng 
    public List<AdminUserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(user -> {
            AdminUserDTO dto = new AdminUserDTO();
            dto.setId(user.getId());
            dto.setUsername(user.getUsername());
            dto.setEmail(user.getEmail());
            dto.setIsActive(user.getIsActive());
            dto.setCreatedAt(user.getCreatedAt());
            dto.setRoles(user.getRoles().stream().map(r -> r.getName()).collect(Collectors.toSet()));
            return dto;
        }).collect(Collectors.toList());
    }

    // Khóa hoặc mở khóa tài khoản người dùng 
    public void toggleUserStatus(Integer userId, Boolean status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + userId));
        user.setIsActive(status);
        userRepository.save(user);
    }
}
