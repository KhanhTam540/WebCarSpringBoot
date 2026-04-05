package Nhom21.weboto.controller;

import Nhom21.weboto.dto.ComboDto;
import Nhom21.weboto.exception.GlobalExceptionHandler;
import Nhom21.weboto.exception.ResourceNotFoundException;
import Nhom21.weboto.security.JwtAuthenticationFilter;
import Nhom21.weboto.service.ComboService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = ComboController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class ComboControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ComboService comboService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void getActiveCombos_returnsOnlyActiveCombos() throws Exception {
        when(comboService.findActiveCombos()).thenReturn(List.of(sampleComboDto()));

        mockMvc.perform(get("/api/v1/combos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(11))
                .andExpect(jsonPath("$[0].active").value(true))
                .andExpect(jsonPath("$[0].items[1].partName").value("Dầu phanh DOT4"));
    }

    @Test
    void getCombosByPart_returnsRelatedCombosForPart() throws Exception {
        when(comboService.findActiveCombosByPart(eq(101))).thenReturn(List.of(sampleComboDto()));

        mockMvc.perform(get("/api/v1/combos/by-part/101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].slug").value("combo-bao-duong-phanh"))
                .andExpect(jsonPath("$[0].items[0].partId").value(101));
    }

    @Test
    void getComboById_returnsComboDetail() throws Exception {
        when(comboService.findActiveById(eq(11))).thenReturn(sampleComboDto());

        mockMvc.perform(get("/api/v1/combos/11"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(11))
                .andExpect(jsonPath("$.name").value("Combo bảo dưỡng phanh"))
                .andExpect(jsonPath("$.items[0].quantity").value(2));
    }

    @Test
    void getComboById_returnsNotFoundWhenInactiveOrMissing() throws Exception {
        when(comboService.findActiveById(eq(404)))
                .thenThrow(new ResourceNotFoundException("Không tìm thấy combo đang hoạt động ID: 404"));

        mockMvc.perform(get("/api/v1/combos/404"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").value("RESOURCE_NOT_FOUND"))
                .andExpect(jsonPath("$.message").value("Không tìm thấy combo đang hoạt động ID: 404"));
    }

    private ComboDto sampleComboDto() {
        return new ComboDto(
                11,
                "Combo bảo dưỡng phanh",
                "combo-bao-duong-phanh",
                "Bộ combo thay má phanh và dầu phanh",
                "https://example.com/combo-brake.jpg",
                "PERCENT",
                new BigDecimal("10"),
                true,
                List.of(
                        new ComboDto.ComboItemDto(101, "Má phanh Bosch Premium", 2, 1, null, new BigDecimal("1750000")),
                        new ComboDto.ComboItemDto(202, "Dầu phanh DOT4", 1, 2, null, new BigDecimal("250000"))
                )
        );
    }
}
