package Nhom21.weboto.repository;

import Nhom21.weboto.entity.CarModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CarModelRepository extends JpaRepository<CarModel, Integer> {
    // Tìm danh sách dòng xe dựa trên ID của hãng xe 
    List<CarModel> findByBrandId(Integer brandId);
}