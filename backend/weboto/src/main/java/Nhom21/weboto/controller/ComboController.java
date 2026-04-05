package Nhom21.weboto.controller;

import Nhom21.weboto.dto.ComboDto;
import Nhom21.weboto.service.ComboService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/combos")
public class ComboController {

    @Autowired
    private ComboService comboService;

    @GetMapping
    public ResponseEntity<List<ComboDto>> getActiveCombos() {
        return ResponseEntity.ok(comboService.findActiveCombos());
    }

    @GetMapping("/by-part/{partId}")
    public ResponseEntity<List<ComboDto>> getCombosByPart(@PathVariable Integer partId) {
        return ResponseEntity.ok(comboService.findActiveCombosByPart(partId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComboDto> getComboById(@PathVariable Integer id) {
        return ResponseEntity.ok(comboService.findActiveById(id));
    }
}
