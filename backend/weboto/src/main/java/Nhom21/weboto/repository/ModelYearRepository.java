package Nhom21.weboto.repository;

import Nhom21.weboto.entity.ModelYear;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ModelYearRepository extends JpaRepository<ModelYear, Integer> {
    // Tìm danh sách đời xe dựa trên ID của dòng xe 
    List<ModelYear> findByCarModelId(Integer modelId);
}