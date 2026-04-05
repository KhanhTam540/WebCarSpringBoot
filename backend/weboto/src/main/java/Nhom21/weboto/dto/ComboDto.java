package Nhom21.weboto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComboDto {
    private Integer id;
    private String name;
    private String slug;
    private String description;
    private String imageUrl;
    private String discountType;
    private BigDecimal discountValue;
    private Boolean active;
    private List<ComboItemDto> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ComboItemDto {
        private Integer partId;
        private String partName;
        private Integer quantity;
        private Integer sortOrder;
        private String imageUrl;
        private BigDecimal unitPrice;
    }
}
