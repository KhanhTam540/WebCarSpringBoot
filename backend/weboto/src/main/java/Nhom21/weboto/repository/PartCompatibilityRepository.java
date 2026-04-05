package Nhom21.weboto.repository;

import Nhom21.weboto.entity.PartCompatibility;
import Nhom21.weboto.entity.PartCompatibilityId; // 1. NHỚ IMPORT LỚP ID NÀY
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
// 2. THAY ĐỔI Integer THÀNH PartCompatibilityId Ở ĐÂY
public interface PartCompatibilityRepository extends JpaRepository<PartCompatibility, PartCompatibilityId> {
    
    // Tìm tất cả các mối liên kết dựa trên đời xe (Dùng cho API tra cứu của User)
    List<PartCompatibility> findByModelYearId(Integer modelYearId);

    // Tìm tất cả các đời xe mà một phụ tùng có thể lắp (Dùng cho trang chi tiết sản phẩm)
    List<PartCompatibility> findByPartId(Integer partId);

    // Kiểm tra xem phụ tùng và đời xe đã được kết nối chưa để tránh trùng lặp
    boolean existsByPartIdAndModelYearId(Integer partId, Integer modelYearId);
}