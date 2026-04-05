package Nhom21.weboto.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComboItemId implements Serializable {
    private Integer combo;
    private Integer part;
}
