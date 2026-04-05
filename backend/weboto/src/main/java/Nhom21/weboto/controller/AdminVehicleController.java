package Nhom21.weboto.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Nhom21.weboto.dto.BrandDTO;
import Nhom21.weboto.dto.CarModelDTO;
import Nhom21.weboto.dto.ModelYearDTO;
import Nhom21.weboto.service.BrandService;
import Nhom21.weboto.service.CarModelService;
import Nhom21.weboto.service.ModelYearService;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminVehicleController {

    @Autowired private BrandService brandService;
    @Autowired private CarModelService carModelService;
    @Autowired private ModelYearService modelYearService;

    // --- BRANDS ---
    @PostMapping("/brands")
    public ResponseEntity<BrandDTO> createBrand(@RequestBody BrandDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(brandService.save(dto));
    }

    @GetMapping("/brands")
    public ResponseEntity<List<BrandDTO>> getAllBrands() {
        return ResponseEntity.ok(brandService.findAll());
    }

    @PutMapping("/brands/{id}")
    public ResponseEntity<BrandDTO> updateBrand(@PathVariable Integer id, @RequestBody BrandDTO dto) {
        return ResponseEntity.ok(brandService.update(id, dto));
    }

    @DeleteMapping("/brands/{id}")
    public ResponseEntity<Void> deleteBrand(@PathVariable Integer id) {
        brandService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // --- MODELS ---
    @PostMapping("/models")
    public ResponseEntity<CarModelDTO> createModel(@RequestBody CarModelDTO dto) {
        // Lưu ý: dto cần chứa brandId để liên kết tầng 1 và 2 [cite: 6]
        return ResponseEntity.status(HttpStatus.CREATED).body(carModelService.save(dto));
    }

    @GetMapping("/models")
    public ResponseEntity<List<CarModelDTO>> getAllModels() {
        return ResponseEntity.ok(carModelService.findAll());
    }

    @PutMapping("/models/{id}")
    public ResponseEntity<CarModelDTO> updateModel(@PathVariable Integer id, @RequestBody CarModelDTO dto) {
        return ResponseEntity.ok(carModelService.update(id, dto));
    }

    @DeleteMapping("/models/{id}")
    public ResponseEntity<Void> deleteModel(@PathVariable Integer id) {
        carModelService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // --- MODEL YEARS ---
    @PostMapping("/model-years")
    public ResponseEntity<ModelYearDTO> createModelYear(@RequestBody ModelYearDTO dto) {
        // Lưu ý: dùng trường yearNumber như bạn đã đổi [cite: 7]
        return ResponseEntity.status(HttpStatus.CREATED).body(modelYearService.save(dto));
    }

    @GetMapping("/model-years")
    public ResponseEntity<List<ModelYearDTO>> getAllModelYears() {
        return ResponseEntity.ok(modelYearService.findAll());
    }

    @PutMapping("/model-years/{id}")
    public ResponseEntity<ModelYearDTO> updateModelYear(@PathVariable Integer id, @RequestBody ModelYearDTO dto) {
        return ResponseEntity.ok(modelYearService.update(id, dto));
    }

    @DeleteMapping("/model-years/{id}")
    public ResponseEntity<Void> deleteModelYear(@PathVariable Integer id) {
        modelYearService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
