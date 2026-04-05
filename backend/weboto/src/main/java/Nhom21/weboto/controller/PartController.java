package Nhom21.weboto.controller;

import Nhom21.weboto.dto.PartDTO;
import Nhom21.weboto.dto.PartDetailDTO;
import Nhom21.weboto.service.PartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/parts")
public class PartController {

    @Autowired
    private PartService partService;

    // API: GET /api/v1/parts/search?modelYearId=10&keyword=má phanh
    @GetMapping("/search")
    public ResponseEntity<List<PartDTO>> searchParts(
            @RequestParam(required = false) Integer brandId,
            @RequestParam(required = false) Integer modelId,
            @RequestParam(required = false) Integer modelYearId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId) { 
        return ResponseEntity.ok(partService.searchParts(brandId, modelId, modelYearId, keyword, categoryId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PartDetailDTO> getPartById(@PathVariable Integer id) {
        return ResponseEntity.ok(partService.findById(id));
    }
}
