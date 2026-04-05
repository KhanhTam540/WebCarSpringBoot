package Nhom21.weboto.service;

import Nhom21.weboto.dto.DashboardStatsDTO;
import Nhom21.weboto.dto.OrderDTO;
import Nhom21.weboto.dto.OrderItemDTO;
import Nhom21.weboto.dto.RevenueDTO;
import Nhom21.weboto.entity.Order;
import Nhom21.weboto.repository.OrderRepository;
import Nhom21.weboto.repository.PartRepository;
import Nhom21.weboto.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StatisticsService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private PartRepository partRepository;
    @Autowired private UserRepository userRepository;

    public List<RevenueDTO> getDailyStatistics() {
        List<Object[]> results = orderRepository.getDailyRevenueNative();
        return results.stream()
                .map(result -> new RevenueDTO((String) result[0], ((Number) result[1]).doubleValue()))
                .collect(Collectors.toList());
    }

    public List<RevenueDTO> getMonthlyStatistics() {
        List<Object[]> results = orderRepository.getMonthlyRevenueNative();
        return results.stream()
                .map(result -> new RevenueDTO((String) result[0], ((Number) result[1]).doubleValue()))
                .collect(Collectors.toList());
    }

    public DashboardStatsDTO getDashboardStats() {
        Double totalRevenue = orderRepository.findAll().stream()
                .filter(o -> o.getStatus().name().equals("PAID") || o.getStatus().name().equals("SHIPPING"))
                .map(Order::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();

        Long orderCount = orderRepository.count();
        Long partCount = partRepository.count();
        Long userCount = userRepository.count();

        List<OrderDTO> recentOrders = orderRepository.findTop10ByOrderByCreatedAtDesc().stream()
                .map(this::mapToOrderDto)
                .collect(Collectors.toList());

        return new DashboardStatsDTO(totalRevenue, orderCount, partCount, userCount, recentOrders);
    }

    private OrderDTO mapToOrderDto(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setUsername(order.getUser().getUsername());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setStatus(order.getStatus());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setCreatedAt(order.getCreatedAt());
        
        if (order.getItems() != null) {
            dto.setItems(order.getItems().stream().map(item -> {
                return new OrderItemDTO(
                    item.getId(),
                    item.getPart().getId(),
                    item.getPart().getName(),
                    item.getPart().getImageUrl(),
                    item.getQuantity(),
                    item.getUnitPrice()
                );
            }).collect(Collectors.toList()));
        }
        
        return dto;
    }
}
