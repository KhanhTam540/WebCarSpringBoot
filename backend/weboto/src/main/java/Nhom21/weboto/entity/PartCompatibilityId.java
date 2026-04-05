package Nhom21.weboto.entity;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartCompatibilityId implements Serializable {
    private Integer part;      // Phải trùng tên với field trong Entity
    private Integer modelYear; // Phải trùng tên với field trong Entity
}
