package Nhom21.weboto.repository;

import Nhom21.weboto.entity.Combo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComboRepository extends JpaRepository<Combo, Integer> {
    List<Combo> findByActiveTrueOrderByIdDesc();

    Optional<Combo> findByIdAndActiveTrue(Integer id);

    Optional<Combo> findBySlug(String slug);
}
