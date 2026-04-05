package Nhom21.weboto.repository;

import Nhom21.weboto.entity.Order;
import Nhom21.weboto.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    // Thống kê theo ngày: Trả về danh sách mảng Object [ngày, tổng tiền]
    @Query(value = "SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as date, SUM(total_price) " +
                   "FROM orders WHERE status IN ('PAID', 'SHIPPING') " +
                   "GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d') " +
                   "ORDER BY date ASC", nativeQuery = true)
    List<Object[]> getDailyRevenueNative();

    // Thống kê theo tháng: Trả về danh sách mảng Object [tháng, tổng tiền]
    @Query(value = "SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(total_price) " +
                   "FROM orders WHERE status IN ('PAID', 'SHIPPING') " +
                   "GROUP BY DATE_FORMAT(created_at, '%Y-%m') " +
                   "ORDER BY month ASC", nativeQuery = true)
    List<Object[]> getMonthlyRevenueNative();

    List<Order> findByUser(User user);
    
    // Thêm query lấy TOP đơn hàng mới nhất cho Dashboard
    List<Order> findTop10ByOrderByCreatedAtDesc();

    @Query("SELECT COUNT(o) FROM Order o JOIN o.items i WHERE o.user.id = :userId AND i.part.id = :partId AND o.status IN ('PAID', 'SHIPPING', 'COMPLETED')")
    long countOrdersByUserAndPartAndStatus(@org.springframework.data.repository.query.Param("userId") Integer userId, @org.springframework.data.repository.query.Param("partId") Integer partId);
}
