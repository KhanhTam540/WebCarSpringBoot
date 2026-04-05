package Nhom21.weboto.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteItemDto {
    private Integer id;
    private Integer partId;
    private String sku;
    private String name;
    private BigDecimal price;
    private Integer stockQuantity;
    private String imageUrl;
    private Integer categoryId;
    private String categoryName;
}
