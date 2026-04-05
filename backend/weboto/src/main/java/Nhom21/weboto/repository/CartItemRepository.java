package Nhom21.weboto.repository;

import Nhom21.weboto.entity.CartItem;
import Nhom21.weboto.entity.Part;
import Nhom21.weboto.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

    // 1. Lấy toàn bộ danh sách món đồ trong giỏ của một User cụ thể
    List<CartItem> findByUser(User user);

    // 2. Tìm một món đồ cụ thể trong giỏ để kiểm tra đã tồn tại chưa (Dùng khi Thêm vào giỏ)
    Optional<CartItem> findByUserAndPart(User user, Part part);

    // 3. Xóa sạch giỏ hàng của User (Dùng sau khi thanh toán thành công)
    void deleteByUser(User user);
}
