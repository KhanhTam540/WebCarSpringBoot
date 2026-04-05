package Nhom21.weboto.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "model_years")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ModelYear {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "year_number", nullable = false)
    private Integer yearNumber; // Ví dụ: 2020, 2024 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "model_id")
    private CarModel carModel; // Liên kết với Tầng 2 (Car Models) 
}