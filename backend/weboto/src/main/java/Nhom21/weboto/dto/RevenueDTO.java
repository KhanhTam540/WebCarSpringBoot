package Nhom21.weboto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevenueDTO {
    private String period;      // Ngày (YYYY-MM-DD) hoặc Tháng (YYYY-MM)
    private Double totalRevenue;
}
