package Nhom21.weboto.dto;

import Nhom21.weboto.entity.OrderStatus;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    private Integer id;
    private String username;       // Tên user đặt hàng (cho Admin)
    private BigDecimal totalPrice;
    private OrderStatus status;
    private String shippingAddress;
    private String paymentMethod;
    private LocalDateTime createdAt;
    private List<OrderItemDTO> items;
}