package Nhom21.weboto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private Double totalRevenue;
    private Long orderCount;
    private Long partCount;
    private Long userCount;
    private List<OrderDTO> recentOrders;
}
