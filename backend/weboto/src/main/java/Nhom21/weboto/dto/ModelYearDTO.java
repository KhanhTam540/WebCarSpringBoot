package Nhom21.weboto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModelYearDTO {
    private Integer id;
    private Integer yearNumber;
    private Integer modelId;
    private String modelName; // THÊM DÒNG NÀY ĐỂ HẾT LỖI
}