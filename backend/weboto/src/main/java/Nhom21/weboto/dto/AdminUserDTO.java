package Nhom21.weboto.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class AdminUserDTO {
    private Integer id;
    private String username;
    private String email;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private Set<String> roles;
}
