package Nhom21.weboto.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Integer partId;
    private Integer rating; // 1-5
    private String comment;
}
