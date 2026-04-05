package Nhom21.weboto.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class AddToCartRequest {
    @NotNull(message = "must not be null")
    @Positive(message = "must be greater than 0")
    private Integer partId;

    @NotNull(message = "must not be null")
    @Positive(message = "must be greater than 0")
    private Integer quantity;
}
