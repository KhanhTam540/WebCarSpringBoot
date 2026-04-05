package Nhom21.weboto.controller;

import Nhom21.weboto.dto.FavoriteItemDto;
import Nhom21.weboto.entity.User;
import Nhom21.weboto.exception.GlobalExceptionHandler;
import Nhom21.weboto.security.JwtAuthenticationFilter;
import Nhom21.weboto.service.FavoriteService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = FavoriteController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class FavoriteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FavoriteService favoriteService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void getFavorites_returnsCurrentUsersFavoriteItems() throws Exception {
        User user = new User();
        user.setId(7);
        user.setUsername("alice");

        when(favoriteService.getFavorites(eq(user))).thenReturn(List.of(
                new FavoriteItemDto(
                        1,
                        101,
                        "FAVORITE-101",
                        "Má phanh Bosch Premium",
                        new BigDecimal("1750000"),
                        12,
                        null,
                        7,
                        "Phanh"
                )
        ));

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user, null, List.of());

        mockMvc.perform(get("/api/v1/favorites").with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].partId").value(101))
                .andExpect(jsonPath("$[0].name").value("Má phanh Bosch Premium"));
    }

    @Test
    void addFavorite_addsPartForCurrentUser() throws Exception {
        User user = new User();
        user.setId(7);
        user.setUsername("alice");

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user, null, List.of());

        mockMvc.perform(post("/api/v1/favorites/101").with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.partId").value(101));

        verify(favoriteService).addFavorite(eq(user), eq(101));
    }

    @Test
    void removeFavorite_deletesPartForCurrentUser() throws Exception {
        User user = new User();
        user.setId(7);
        user.setUsername("alice");

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user, null, List.of());

        mockMvc.perform(delete("/api/v1/favorites/101").with(authentication(auth)))
                .andExpect(status().isNoContent());

        verify(favoriteService).removeFavorite(eq(user), eq(101));
    }
}
