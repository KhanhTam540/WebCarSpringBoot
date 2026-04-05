package Nhom21.weboto.controller;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Nhom21.weboto.dto.AddToCartRequest;
import Nhom21.weboto.dto.CartItemDTO;
import Nhom21.weboto.entity.User;
import Nhom21.weboto.service.CartService;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {
    @Autowired private CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItemDTO>> getMyCart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cartService.getCart(user));
    }

    @PostMapping("/items")
    public ResponseEntity<String> addToCart(
            @AuthenticationPrincipal User user, 
            @Valid @RequestBody AddToCartRequest req) {
        
        // Nhận chuỗi thông báo từ Service
        String message = cartService.addItem(user, req.getPartId(), req.getQuantity());
        return ResponseEntity.ok(message);
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<String> updateCartItem(
            @PathVariable Integer itemId, 
            @RequestParam Integer quantity) {
        try {
            // 1. Gọi hàm cập nhật
            cartService.updateQuantity(itemId, quantity);
            
            // 2. Nếu thành công, trả về 200 OK
            return ResponseEntity.ok("Cập nhật số lượng thành công");
        } catch (RuntimeException ex) {
            // 3. Nếu xảy ra lỗi (ví dụ: không đủ tồn kho), trả về 400 và nội dung lỗi
            return ResponseEntity.badRequest().body("Lỗi: " + ex.getMessage());
        }
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<String> removeFromCart(@PathVariable Integer itemId) {
        try {
            // Gọi service và nhận thông báo thành công
            String message = cartService.removeItem(itemId);
            return ResponseEntity.ok(message);
            
        } catch (RuntimeException ex) {
            // Nếu không tìm thấy sản phẩm, trả về lỗi 404 và nội dung lỗi
            System.err.println("LOG: [Lỗi xóa] " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
}
