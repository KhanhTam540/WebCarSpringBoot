package Nhom21.weboto.controller;

import Nhom21.weboto.dto.ModelYearDTO;
import Nhom21.weboto.service.ModelYearService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class ModelYearController {

    @Autowired
    private ModelYearService modelYearService;

    // API CŨ: Lấy theo model
    @GetMapping("/models/{modelId}/years")
    public ResponseEntity<List<ModelYearDTO>> getYearsByModel(@PathVariable Integer modelId) {
        List<ModelYearDTO> years = modelYearService.getYearsByModel(modelId);
        return ResponseEntity.ok(years);
    }

    // API MỚI: Lấy TẤT CẢ đời xe [SỬA LỖI 404]
    @GetMapping("/model-years")
    public ResponseEntity<List<ModelYearDTO>> getAllYears() {
        // Bạn cần thêm hàm getAllYears() vào ModelYearService
        return ResponseEntity.ok(modelYearService.getAllYears());
    }
}