package Nhom21.weboto.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "brands")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Brand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name; // Ví dụ: Toyota, Honda 

    private String logoUrl; // Đường dẫn ảnh logo hãng xe 

    @OneToMany(mappedBy = "brand", cascade = CascadeType.ALL)
    private List<CarModel> models;
}