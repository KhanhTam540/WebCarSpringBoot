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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Nhom21.weboto.dto.CategoryDTO;
import Nhom21.weboto.dto.PartDTO;
import Nhom21.weboto.service.CategoryService;
import Nhom21.weboto.service.PartService;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPartController {
    @Autowired
    private PartService partService;
    @Autowired private CategoryService categoryService;

    @PostMapping("/categories")
    public ResponseEntity<CategoryDTO> createCategory(@RequestBody CategoryDTO dto) {
        return ResponseEntity.ok(categoryService.save(dto));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        return ResponseEntity.ok(categoryService.findAll());
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable Integer id, @RequestBody CategoryDTO dto) {
        return ResponseEntity.ok(categoryService.update(id, dto));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Integer id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/parts")
    public ResponseEntity<PartDTO> createPart(@RequestBody PartDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(partService.save(dto));
    }

    @PutMapping("/parts/{id}")
    public ResponseEntity<PartDTO> updatePart(@PathVariable Integer id, @RequestBody PartDTO dto) {
        return ResponseEntity.ok(partService.update(id, dto));
    }

    @GetMapping("/parts")
    public ResponseEntity<List<PartDTO>> getAllParts() {
        return ResponseEntity.ok(partService.findAll());
    }

    @DeleteMapping("/parts/{id}")
    public ResponseEntity<Void> deletePart(@PathVariable Integer id) {
        partService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/parts/{partId}/compatibility")
    public ResponseEntity<String> setCompatibility(
        @PathVariable Integer partId, 
        @RequestParam Integer modelYearId) {
    
    partService.addCompatibility(partId, modelYearId);
    return ResponseEntity.ok("Thiết lập đời xe tương thích thành công!");
    }

    @DeleteMapping("/parts/{partId}/compatibility")
    public ResponseEntity<String> deleteCompatibility(
        @PathVariable Integer partId, 
        @RequestParam Integer modelYearId) {
    
    partService.removeCompatibility(partId, modelYearId);
    return ResponseEntity.ok("Xóa đời xe tương thích thành công!");
    }

}
