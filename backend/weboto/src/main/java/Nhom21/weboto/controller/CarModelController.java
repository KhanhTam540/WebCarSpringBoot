package Nhom21.weboto.controller;

import Nhom21.weboto.dto.CarModelDTO;
import Nhom21.weboto.service.CarModelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1") // Đổi gốc RequestMapping để hỗ trợ nhiều loại đường dẫn
public class CarModelController {

    @Autowired
    private CarModelService carModelService;

    // API CŨ: Lấy theo hãng
    @GetMapping("/brands/{brandId}/models")
    public ResponseEntity<List<CarModelDTO>> getModelsByBrand(@PathVariable Integer brandId) {
        List<CarModelDTO> models = carModelService.getModelsByBrand(brandId);
        return ResponseEntity.ok(models);
    }

    // API MỚI: Lấy TẤT CẢ dòng xe để hiển thị bảng Admin [SỬA LỖI 404]
    @GetMapping("/models")
    public ResponseEntity<List<CarModelDTO>> getAllModels() {
        // Bạn cần thêm hàm getAllModels() vào CarModelService
        return ResponseEntity.ok(carModelService.getAllModels());
    }
}