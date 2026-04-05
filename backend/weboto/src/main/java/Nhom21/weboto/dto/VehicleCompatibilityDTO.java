package Nhom21.weboto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleCompatibilityDTO {
    private Integer modelYearId;
    private String brandName;
    private String modelName;
    private Integer yearNumber;
}
