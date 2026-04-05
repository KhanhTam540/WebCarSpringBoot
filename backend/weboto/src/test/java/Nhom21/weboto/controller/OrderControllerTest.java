package Nhom21.weboto.controller;

import Nhom21.weboto.dto.OrderDTO;
import Nhom21.weboto.entity.OrderStatus;
import Nhom21.weboto.exception.GlobalExceptionHandler;
import Nhom21.weboto.security.JwtAuthenticationFilter;
import Nhom21.weboto.service.OrderService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = OrderController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderService orderService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void getOrderById_returnsCanonicalOrderFields() throws Exception {
        OrderDTO dto = new OrderDTO(
                55,
                "alice",
                new BigDecimal("1250000"),
                OrderStatus.PENDING,
                "123 Example Street",
                "COD",
                LocalDateTime.of(2026, 3, 25, 12, 0),
                List.of()
        );

        when(orderService.getOrderById(55)).thenReturn(dto);

        mockMvc.perform(get("/api/v1/orders/55").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(55))
                .andExpect(jsonPath("$.shippingAddress").value("123 Example Street"))
                .andExpect(jsonPath("$.totalPrice").value(1250000))
                .andExpect(jsonPath("$.address").doesNotExist())
                .andExpect(jsonPath("$.totalAmount").doesNotExist());
    }

    @Test
    void getOrderById_returnsStableErrorShapeWhenMissing() throws Exception {
        when(orderService.getOrderById(999)).thenThrow(new RuntimeException("Không tìm thấy đơn hàng ID: 999"));

        mockMvc.perform(get("/api/v1/orders/999").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.code").value("RESOURCE_NOT_FOUND"))
                .andExpect(jsonPath("$.message").value("Không tìm thấy đơn hàng ID: 999"));
    }
}
