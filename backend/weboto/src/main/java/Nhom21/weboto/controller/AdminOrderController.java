package Nhom21.weboto.controller;

import Nhom21.weboto.dto.OrderDTO;
import Nhom21.weboto.entity.Order;
import Nhom21.weboto.entity.OrderStatus;
import Nhom21.weboto.repository.OrderRepository;
import Nhom21.weboto.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Admin Order Management Controller
 * Base URL: /api/v1/admin/orders
 */
@RestController
@RequestMapping("/api/v1/admin/orders")
public class AdminOrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderService orderService;

    /**
     * GET /api/v1/admin/orders - Lấy toàn bộ danh sách đơn hàng (admin only)
     */
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    /**
     * GET /api/v1/admin/orders/{id} - Xem chi tiết một đơn hàng
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(orderService.getOrderById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * PATCH /api/v1/admin/orders/{id}/status - Cập nhật trạng thái đơn hàng
     * Body JSON: {"status":"PAID"} hoặc {"status":"SHIPPING"} hoặc {"status":"COMPLETED"} hoặc {"status":"CANCELLED"}
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<String> updateOrderStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body) {
        try {
            String statusStr = body.get("status");
            OrderStatus newStatus = OrderStatus.valueOf(statusStr);
            Order order = orderRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng ID: " + id));
            order.setStatus(newStatus);
            orderRepository.save(order);
            return ResponseEntity.ok("Cập nhật trạng thái đơn hàng thành công!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Trạng thái không hợp lệ!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * PATCH /api/v1/admin/orders/{id}/address - Cập nhật địa chỉ giao hàng
     */
    @PatchMapping("/{id}/address")
    public ResponseEntity<String> updateShippingAddress(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body) {
        try {
            String newAddress = body.get("shippingAddress");
            Order order = orderRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng ID: " + id));
            order.setShippingAddress(newAddress);
            orderRepository.save(order);
            return ResponseEntity.ok("Cập nhật địa chỉ thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
