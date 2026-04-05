package Nhom21.weboto.controller;

import Nhom21.weboto.dto.ComboDto;
import Nhom21.weboto.service.ComboService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminComboController {

    @Autowired
    private ComboService comboService;

    @GetMapping("/combos")
    public ResponseEntity<List<ComboDto>> getAllCombos() {
        return ResponseEntity.ok(comboService.findAll());
    }

    @PostMapping("/combos")
    public ResponseEntity<ComboDto> createCombo(@RequestBody ComboDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(comboService.save(dto));
    }

    @PutMapping("/combos/{id}")
    public ResponseEntity<ComboDto> updateCombo(@PathVariable Integer id, @RequestBody ComboDto dto) {
        return ResponseEntity.ok(comboService.update(id, dto));
    }

    @PatchMapping("/combos/{id}/active")
    public ResponseEntity<ComboDto> toggleActive(@PathVariable Integer id, @RequestParam Boolean active) {
        return ResponseEntity.ok(comboService.setActive(id, active));
    }

    @DeleteMapping("/combos/{id}")
    public ResponseEntity<Void> deleteCombo(@PathVariable Integer id) {
        comboService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
