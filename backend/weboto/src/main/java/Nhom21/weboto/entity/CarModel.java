package Nhom21.weboto.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "car_models")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class CarModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "model_name", nullable = false)
    private String modelName; // Ví dụ: Camry, Vios, Civic 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand; // Liên kết với Tầng 1 (Brands) 

    @OneToMany(mappedBy = "carModel", cascade = CascadeType.ALL)
    private List<ModelYear> years;
}