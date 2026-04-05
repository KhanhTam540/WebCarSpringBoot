package Nhom21.weboto.dto;

import lombok.Data;
import java.util.Set;

@Data
public class UserDTO {
    private String username;
    private String email;
    private Set<String> roles;
}
