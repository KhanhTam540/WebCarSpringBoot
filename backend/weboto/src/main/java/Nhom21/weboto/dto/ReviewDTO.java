package Nhom21.weboto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDTO {
    private Integer id;
    private Integer userId;
    private String userFullName;
    private Integer partId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
