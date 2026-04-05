package Nhom21.weboto.controller;

import Nhom21.weboto.dto.ImageSearchResponse;
import Nhom21.weboto.service.ImageSearchService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/search")
public class ImageSearchController {

    private final ImageSearchService imageSearchService;

    public ImageSearchController(ImageSearchService imageSearchService) {
        this.imageSearchService = imageSearchService;
    }

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageSearchResponse> searchByImage(@RequestParam("image") MultipartFile image) {
        return ResponseEntity.ok(imageSearchService.searchByImage(image));
    }
}
