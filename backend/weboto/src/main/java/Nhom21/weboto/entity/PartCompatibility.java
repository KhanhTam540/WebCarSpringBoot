package Nhom21.weboto.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "part_compatibility")
@IdClass(PartCompatibilityId.class) // Sử dụng PartCompatibilityId làm khóa chính
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class PartCompatibility {

    @Id // Đánh dấu là một phần của khóa chính
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "part_id")
    private Part part;

    @Id // Đánh dấu là một phần của khóa chính
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "model_year_id")
    private ModelYear modelYear;
}