package Nhom21.weboto.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "categories")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name; // Ví dụ: Hệ thống phanh, Giảm xóc 

    private String description;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Part> parts;
}