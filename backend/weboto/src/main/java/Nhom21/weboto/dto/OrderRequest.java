package Nhom21.weboto.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private String address;
    private String paymentMethod;
    private List<Integer> cartItemIds;
}