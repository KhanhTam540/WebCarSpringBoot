package Nhom21.weboto.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import Nhom21.weboto.dto.OrderDTO;
import Nhom21.weboto.dto.OrderRequest;
import Nhom21.weboto.entity.User;
import Nhom21.weboto.exception.ResourceNotFoundException;
import Nhom21.weboto.service.OrderService;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {
    @Autowired private OrderService orderService;

    // POST /api/v1/orders: Thanh toán các sản phẩm được chọn
    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(
            @AuthenticationPrincipal User user,
            @RequestBody OrderRequest req) {
        return ResponseEntity.ok(orderService.placeOrder(req, user));
    }

    // GET /api/v1/orders: Lịch sử đơn hàng
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getMyOrders(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.findByUser(user));
    }

    // GET /api/v1/orders/lookup/{id}: Tra cứu đơn hàng công khai
    @GetMapping("/lookup/{id}")
    public ResponseEntity<OrderDTO> lookupOrder(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(orderService.getOrderById(id));
        } catch (RuntimeException ex) {
            throw new ResourceNotFoundException("Không tìm thấy đơn hàng mã #" + id);
        }
    }

    // GET /api/v1/orders/{id}: Xem chi tiết đơn hàng (Dành cho chủ đơn hàng)
    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Integer id) {
        try {
            OrderDTO orderDTO = orderService.getOrderById(id);
            return ResponseEntity.ok(orderDTO);
        } catch (RuntimeException ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
    }
}
