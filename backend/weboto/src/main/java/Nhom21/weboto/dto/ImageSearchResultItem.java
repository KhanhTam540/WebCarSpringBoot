package Nhom21.weboto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageSearchResultItem {
    private Integer id;
    private String sku;
    private String name;
    private BigDecimal price;
    private Integer stockQuantity;
    private String imageUrl;
    private Integer categoryId;
    private String categoryName;
    private Double similarityScore;
}
