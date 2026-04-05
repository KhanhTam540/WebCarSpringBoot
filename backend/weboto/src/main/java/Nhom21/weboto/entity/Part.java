package Nhom21.weboto.entity;

import java.math.BigDecimal;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "parts")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Part {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name; // Tên phụ tùng (ví dụ: Má phanh trước) 

    private String sku; // Mã định danh sản phẩm (Stock Keeping Unit)

    @Column(columnDefinition = "TEXT")
    private String description; // Thông số kỹ thuật chi tiết 

    @Column(nullable = false)
    private BigDecimal price; // Giá bán hiện tại [cite: 10, 17]

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity; // Số lượng tồn kho 

    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category; // Thuộc danh mục nào 

}