package Nhom21.weboto.controller;

import Nhom21.weboto.exception.GlobalExceptionHandler;
import Nhom21.weboto.security.JwtAuthenticationFilter;
import Nhom21.weboto.service.PartService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = PartController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class PartControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PartService partService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void getPartById_returnsOkForExistingPartId() throws Exception {
        mockMvc.perform(get("/api/v1/parts/123"))
                .andExpect(status().isOk());
    }
}
