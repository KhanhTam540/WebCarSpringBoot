package Nhom21.weboto.controller;

import Nhom21.weboto.dto.ImageSearchResponse;
import Nhom21.weboto.dto.ImageSearchResultItem;
import Nhom21.weboto.exception.GlobalExceptionHandler;
import Nhom21.weboto.security.JwtAuthenticationFilter;
import Nhom21.weboto.service.ImageSearchService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = ImageSearchController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class ImageSearchControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ImageSearchService imageSearchService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void uploadImage_returnsSuggestionsForValidImage() throws Exception {
        MockMultipartFile image = new MockMultipartFile(
                "image",
                "phanh-bosch.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "fake-image-content".getBytes()
        );

        when(imageSearchService.searchByImage(any())).thenReturn(sampleResponse());

        mockMvc.perform(multipart("/api/v1/search/image").file(image))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.storedImageUrl").value("/uploads/image-search/phanh-bosch.jpg"))
                .andExpect(jsonPath("$.suggestions[0].id").value(501))
                .andExpect(jsonPath("$.suggestions[0].name").value("Má phanh Bosch Premium"))
                .andExpect(jsonPath("$.suggestions[0].categoryName").value("Phanh"));
    }

    @Test
    void uploadImage_returnsBadRequestForUnsupportedMimeType() throws Exception {
        MockMultipartFile image = new MockMultipartFile(
                "image",
                "document.pdf",
                MediaType.APPLICATION_PDF_VALUE,
                "fake-pdf-content".getBytes()
        );

        when(imageSearchService.searchByImage(any()))
                .thenThrow(new IllegalArgumentException("Định dạng tệp không được hỗ trợ"));

        mockMvc.perform(multipart("/api/v1/search/image").file(image))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.message").value("Định dạng tệp không được hỗ trợ"));
    }

    @Test
    void uploadImage_returnsPayloadTooLargeForOversizedFile() throws Exception {
        MockMultipartFile image = new MockMultipartFile(
                "image",
                "huge-image.png",
                MediaType.IMAGE_PNG_VALUE,
                "oversized-image-content".getBytes()
        );

        when(imageSearchService.searchByImage(any()))
                .thenThrow(new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.PAYLOAD_TOO_LARGE,
                        "Kích thước tệp vượt quá giới hạn cho phép"
                ));

        mockMvc.perform(multipart("/api/v1/search/image").file(image))
                .andExpect(status().isPayloadTooLarge());
    }

    private ImageSearchResponse sampleResponse() {
        return new ImageSearchResponse(
                "/uploads/image-search/phanh-bosch.jpg",
                "brake",
                true,
                "SUCCESS",
                "AI Ready (10/10 indexed)",
                List.of(
                        new ImageSearchResultItem(
                                501,
                                "BOSCH-501",
                                "Má phanh Bosch Premium",
                                new BigDecimal("1750000"),
                                12,
                                "https://example.com/brake-pad.jpg",
                                7,
                                "Phanh",
                                0.95
                        )
                )
        );
    }
}
