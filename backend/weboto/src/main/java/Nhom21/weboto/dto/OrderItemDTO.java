package Nhom21.weboto.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {
    private Integer id;
    private Integer partId;
    private String partName; // Tên phụ tùng để hiển thị trong lịch sử
    private String imageUrl; // Ảnh để hiển thị trong đơn hàng
    private Integer quantity;
    private BigDecimal unitPrice; // Giá thực tế lúc khách hàng nhấn mua
}