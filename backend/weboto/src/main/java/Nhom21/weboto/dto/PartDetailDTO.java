package Nhom21.weboto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class PartDetailDTO extends PartDTO {
    private List<VehicleCompatibilityDTO> compatibleVehicles;

    public PartDetailDTO(Integer id, String name, String sku, String description, 
                        BigDecimal price, Integer stockQuantity, String imageUrl, 
                        Integer categoryId, String categoryName, 
                        List<VehicleCompatibilityDTO> compatibleVehicles) {
        super(id, name, sku, description, price, stockQuantity, imageUrl, categoryId, categoryName);
        this.compatibleVehicles = compatibleVehicles;
    }
}
