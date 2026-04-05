package Nhom21.weboto.controller;

import Nhom21.weboto.dto.CompareResponse;
import Nhom21.weboto.dto.PartDTO;
import Nhom21.weboto.exception.GlobalExceptionHandler;
import Nhom21.weboto.security.JwtAuthenticationFilter;
import Nhom21.weboto.service.CompareService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = CompareController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class CompareControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CompareService compareService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void compareParts_returnsNormalizedComparisonPayloadForTwoProducts() throws Exception {
        when(compareService.compare(eq(List.of(101, 202)))).thenReturn(
                new CompareResponse(
                        List.of(
                                new PartDTO(101, "Má phanh Bosch Premium", "BOSCH-101", "desc-1", new BigDecimal("1750000"), 12, null, 7, "Phanh"),
                                new PartDTO(202, "Má phanh Akebono", "AKE-202", "desc-2", new BigDecimal("1690000"), 8, null, 7, "Phanh")
                        ),
                        List.of("name", "price", "stockQuantity", "categoryName"),
                        Map.of(
                                "name", List.of("Má phanh Bosch Premium", "Má phanh Akebono"),
                                "price", List.of("1750000", "1690000")
                        )
                )
        );

        mockMvc.perform(get("/api/v1/compare").param("partIds", "101", "202"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.parts[0].id").value(101))
                .andExpect(jsonPath("$.parts[1].id").value(202))
                .andExpect(jsonPath("$.comparableFields[0]").value("name"))
                .andExpect(jsonPath("$.comparisonRows.price[0]").value("1750000"));
    }
}
