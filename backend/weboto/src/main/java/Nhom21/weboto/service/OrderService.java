package Nhom21.weboto.service;

import Nhom21.weboto.dto.OrderDTO;
import Nhom21.weboto.dto.OrderItemDTO;
import Nhom21.weboto.dto.OrderRequest;
import Nhom21.weboto.entity.*;
import Nhom21.weboto.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private CartItemRepository cartItemRepository;

    @Transactional
    public OrderDTO placeOrder(OrderRequest request, User user) {
        // 1. Lấy giỏ hàng của người dùng thông qua CartItemRepository
        List<CartItem> allCartItems = cartItemRepository.findByUser(user);

        // 2. Lọc danh sách các ID được chọn từ Frontend
        List<CartItem> selectedItems = allCartItems.stream()
                .filter(item -> request.getCartItemIds().contains(item.getId()))
                .collect(Collectors.toList());

        if (selectedItems.isEmpty()) {
            throw new RuntimeException("Vui lòng chọn sản phẩm để thanh toán!");
        }

        // 3. Khởi tạo đối tượng Order dựa trên Entity bạn đã gửi
        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(request.getAddress()); // Ánh xạ vào trường shippingAddress
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus(OrderStatus.PENDING);

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

 for (CartItem ci : selectedItems) {
    OrderItem oi = new OrderItem();
    oi.setOrder(order);
    oi.setPart(ci.getPart());
    oi.setQuantity(ci.getQuantity());

    // SỬA LỖI TẠI ĐÂY:
    // Vì ci.getPart().getPrice() đã là BigDecimal, bạn gán trực tiếp luôn.
    BigDecimal unitPrice = ci.getPart().getPrice(); 
    oi.setUnitPrice(unitPrice);

    // Tính toán: Nhân giá với số lượng
    BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(oi.getQuantity()));
    total = total.add(itemTotal);

    orderItems.add(oi);
}

        // Ánh xạ vào biến: private List<OrderItem> items;
        order.setItems(orderItems); 
        order.setTotalPrice(total);

        // 4. Lưu đơn hàng và xóa các món đã chọn khỏi giỏ
        orderRepository.save(order);
        cartItemRepository.deleteAll(selectedItems); 

        return mapToDto(order);
    }

    // Phương thức bổ sung để sửa lỗi "undefined" ở Controller
public OrderDTO getOrderById(Integer id) {
    Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng ID: " + id));
    // Khi gọi mapToDto, danh sách items sẽ được nạp và chuyển đổi
    return mapToDto(order);
}

    public List<OrderDTO> findByUser(User user) {
        return orderRepository.findByUser(user).stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }

    // Admin: Lấy tất cả đơn hàng
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }

private OrderDTO mapToDto(Order order) {
    OrderDTO dto = new OrderDTO();
    dto.setId(order.getId());
    // Điền tên user đặt hàng vào DTO (cho Admin)
    if (order.getUser() != null) {
        dto.setUsername(order.getUser().getUsername());
    }
    dto.setTotalPrice(order.getTotalPrice());
    dto.setStatus(order.getStatus());
    dto.setShippingAddress(order.getShippingAddress());
    dto.setPaymentMethod(order.getPaymentMethod());
    dto.setCreatedAt(order.getCreatedAt());

    // KHẮC PHỤC LỖI "items": null TẠI ĐÂY
    if (order.getItems() != null && !order.getItems().isEmpty()) {
        List<OrderItemDTO> itemDtos = order.getItems().stream().map(item -> {
            OrderItemDTO idto = new OrderItemDTO();
            // Lấy tên phụ tùng từ đối tượng Part liên kết
            idto.setPartName(item.getPart().getName()); 
            idto.setQuantity(item.getQuantity());
            idto.setUnitPrice(item.getUnitPrice());
            return idto;
        }).collect(Collectors.toList());
        
        dto.setItems(itemDtos); // Gán danh sách đã map vào DTO
    } else {
        dto.setItems(new ArrayList<>()); // Trả về mảng rỗng [] thay vì null để tránh lỗi Frontend
    }

    return dto;
}
}