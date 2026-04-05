package Nhom21.weboto.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Nhom21.weboto.dto.CartItemDTO;
import Nhom21.weboto.entity.CartItem;
import Nhom21.weboto.entity.Part;
import Nhom21.weboto.entity.User;
import Nhom21.weboto.repository.CartItemRepository;
import Nhom21.weboto.repository.PartRepository;
import jakarta.transaction.Transactional;

@Service
public class CartService {
    @Autowired private CartItemRepository cartItemRepository;
    @Autowired private PartRepository partRepository;

    // Lấy giỏ hàng của User hiện tại
    public List<CartItemDTO> getCart(User user) {
        return cartItemRepository.findByUser(user).stream()
            .map(item -> new CartItemDTO(
                item.getId(), 
                item.getPart().getId(),
                item.getPart().getName(),
                item.getPart().getPrice().doubleValue(),
                item.getQuantity(),
                item.getPart().getImageUrl()
            )).collect(Collectors.toList());
    }

    // Thêm món đồ vào giỏ
    @Transactional
    public String addItem(User user, Integer partId, Integer quantity) {
        Part part = partRepository.findById(partId)
            .orElseThrow(() -> new RuntimeException("Phụ tùng không tồn tại"));

        // Kiểm tra tồn kho trước khi thêm
        if (quantity > part.getStockQuantity()) {
            throw new RuntimeException("Kho không đủ! Chỉ còn: " + part.getStockQuantity());
        }

        CartItem item = cartItemRepository.findByUserAndPart(user, part)
            .orElse(new CartItem());

        if (item.getId() == null) {
            item.setUser(user);
            item.setPart(part);
            item.setQuantity(quantity);
        } else {
            item.setQuantity(item.getQuantity() + quantity);
        }

        cartItemRepository.save(item);
        
        String msg = "Thêm thành công " + quantity + " món " + part.getName() + " vào giỏ.";
        System.out.println("LOG: [Giỏ hàng] " + msg); // Hiện ở VS Code
        return msg; // Trả về để Controller gửi lên Postman
    }

    // Cập nhật số lượng
    @Transactional
    public void updateQuantity(Integer itemId, Integer quantity) {
        // 1. Tìm món đồ trong giỏ
        CartItem item = cartItemRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy món đồ trong giỏ"));

        // 2. Lấy thông tin phụ tùng (Part) liên quan
        Part part = item.getPart();

        // 3. KIỂM TRA TỒN KHO
        if (quantity > part.getStockQuantity()) {
            // In log ra console để Bảo dễ theo dõi khi debug
            System.out.println("LOG: [Lỗi] Phụ tùng " + part.getName() + " không đủ hàng. " +
                            "Yêu cầu: " + quantity + ", Hiện có: " + part.getStockQuantity());
            
            throw new RuntimeException("Số lượng tồn kho không đủ (Hiện còn: " + part.getStockQuantity() + ")");
        }

        // 4. Nếu đủ hàng thì mới cập nhật
        item.setQuantity(quantity);
        cartItemRepository.save(item);

        System.out.println("LOG: [Giỏ hàng] Cập nhật thành công cho: " + part.getName());
    }

    // Xóa khỏi giỏ
    public String removeItem(Integer itemId) {
        // 1. Kiểm tra xem món đồ có tồn tại không
        CartItem item = cartItemRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm này trong giỏ hàng (ID: " + itemId + ")"));
        
        // 2. Nếu có, thực hiện xóa
        String partName = item.getPart().getName();
        cartItemRepository.delete(item);

        // 3. Trả về thông báo thành công
        return "Đã xóa thành công sản phẩm: " + partName;
    }
}