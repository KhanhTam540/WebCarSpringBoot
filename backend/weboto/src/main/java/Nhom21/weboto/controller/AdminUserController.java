package Nhom21.weboto.controller;

import Nhom21.weboto.dto.AdminUserDTO;
import Nhom21.weboto.entity.User;
import Nhom21.weboto.repository.UserRepository;
import Nhom21.weboto.service.AdminUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/users")
public class AdminUserController {

    @Autowired
    private AdminUserService adminUserService;

    @Autowired
    private UserRepository userRepository;

    // API lấy danh sách toàn bộ người dùng
    @GetMapping
    public ResponseEntity<List<AdminUserDTO>> getAllUsers() {
        return ResponseEntity.ok(adminUserService.getAllUsers());
    }

    // API tìm kiếm user theo email
    @GetMapping("/search")
    public ResponseEntity<List<AdminUserDTO>> searchByEmail(@RequestParam String email) {
        List<User> users = userRepository.findByEmailContainingIgnoreCase(email);
        List<AdminUserDTO> dtos = users.stream().map(u -> {
            AdminUserDTO dto = new AdminUserDTO();
            dto.setId(u.getId());
            dto.setUsername(u.getUsername());
            dto.setEmail(u.getEmail());
            dto.setIsActive(u.getIsActive());
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // API Khóa hoặc mở khóa tài khoản
    @PutMapping("/{userId}/status")
    public ResponseEntity<String> updateUserStatus(
            @PathVariable Integer userId,
            @RequestParam Boolean status) {
        try {
            adminUserService.toggleUserStatus(userId, status);
            String message = status ? "Đã mở khóa tài khoản!" : "Đã khóa tài khoản thành công!";
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
