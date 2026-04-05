package Nhom21.weboto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CartItemDTO {
    private Integer id;
    private Integer partId;
    private String partName;
    private Double price;
    private Integer quantity;
    private String imageUrl;
}