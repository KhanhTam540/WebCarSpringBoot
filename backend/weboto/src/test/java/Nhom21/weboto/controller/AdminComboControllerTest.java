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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AdminComboController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class AdminComboControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ComboService comboService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void getAllCombos_returnsAdminComboList() throws Exception {
        when(comboService.findAll()).thenReturn(List.of(sampleComboDto()));

        mockMvc.perform(get("/api/v1/admin/combos").with(authentication(adminAuthentication())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(11))
                .andExpect(jsonPath("$[0].name").value("Combo bảo dưỡng phanh"))
                .andExpect(jsonPath("$[0].items[0].partId").value(101));
    }

    @Test
    void createCombo_createsComboWithItems() throws Exception {
        when(comboService.save(org.mockito.ArgumentMatchers.any(ComboDto.class))).thenReturn(sampleComboDto());

        mockMvc.perform(post("/api/v1/admin/combos")
                        .with(authentication(adminAuthentication()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Combo bảo dưỡng phanh",
                                  "slug": "combo-bao-duong-phanh",
                                  "description": "Bộ combo thay má phanh và dầu phanh",
                                  "imageUrl": "https://example.com/combo-brake.jpg",
                                  "discountType": "PERCENT",
                                  "discountValue": 10,
                                  "active": true,
                                  "items": [
                                    {
                                      "partId": 101,
                                      "quantity": 2,
                                      "sortOrder": 1
                                    }
                                  ]
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(11))
                .andExpect(jsonPath("$.slug").value("combo-bao-duong-phanh"))
                .andExpect(jsonPath("$.items[0].quantity").value(2));
    }

    @Test
    void updateCombo_updatesComboPayload() throws Exception {
        ComboDto updated = sampleComboDto();
        updated.setName("Combo phanh cao cấp");
        when(comboService.update(eq(11), org.mockito.ArgumentMatchers.any(ComboDto.class))).thenReturn(updated);

        mockMvc.perform(put("/api/v1/admin/combos/11")
                        .with(authentication(adminAuthentication()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Combo phanh cao cấp",
                                  "slug": "combo-bao-duong-phanh",
                                  "description": "Cập nhật mô tả",
                                  "imageUrl": "https://example.com/combo-brake.jpg",
                                  "discountType": "PERCENT",
                                  "discountValue": 12,
                                  "active": true,
                                  "items": [
                                    {
                                      "partId": 101,
                                      "quantity": 1,
                                      "sortOrder": 1
                                    },
                                    {
                                      "partId": 202,
                                      "quantity": 1,
                                      "sortOrder": 2
                                    }
                                  ]
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Combo phanh cao cấp"));
    }

    @Test
    void toggleActive_updatesActiveFlag() throws Exception {
        ComboDto inactive = sampleComboDto();
        inactive.setActive(false);
        when(comboService.setActive(eq(11), eq(false))).thenReturn(inactive);

        mockMvc.perform(patch("/api/v1/admin/combos/11/active")
                        .with(authentication(adminAuthentication()))
                        .param("active", "false"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.active").value(false));

        verify(comboService).setActive(eq(11), eq(false));
    }

    @Test
    void updateCombo_returnsNotFoundWhenComboMissing() throws Exception {
        when(comboService.update(eq(999), org.mockito.ArgumentMatchers.any(ComboDto.class)))
                .thenThrow(new ResourceNotFoundException("Không tìm thấy combo ID: 999"));

        mockMvc.perform(put("/api/v1/admin/combos/999")
                        .with(authentication(adminAuthentication()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Combo không tồn tại",
                                  "slug": "combo-khong-ton-tai"
                                }
                                """))
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").value("RESOURCE_NOT_FOUND"))
                .andExpect(jsonPath("$.message").value("Không tìm thấy combo ID: 999"));
    }

    private UsernamePasswordAuthenticationToken adminAuthentication() {
        return new UsernamePasswordAuthenticationToken("admin", null, List.of());
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
