package Nhom21.weboto.repository;

import Nhom21.weboto.entity.Part;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface PartRepository extends JpaRepository<Part, Integer> {
    
    // Giữ các hàm cũ
    List<Part> findByNameContainingIgnoreCase(String name);
    List<Part> findByCategoryId(Integer categoryId);

    // Cập nhật hàm searchParts nhận thêm brandId và modelId
    @Query("SELECT DISTINCT p FROM Part p " +
           "LEFT JOIN PartCompatibility pc ON p.id = pc.part.id " +
           "WHERE (:brandId IS NULL OR pc.modelYear.carModel.brand.id = :brandId) " +
           "AND (:modelId IS NULL OR pc.modelYear.carModel.id = :modelId) " +
           "AND (:modelYearId IS NULL OR pc.modelYear.id = :modelYearId) " +
           "AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:categoryId IS NULL OR p.category.id = :categoryId)") 
    List<Part> searchParts(@Param("brandId") Integer brandId,
                           @Param("modelId") Integer modelId,
                           @Param("modelYearId") Integer modelYearId, 
                           @Param("keyword") String keyword,
                           @Param("categoryId") Integer categoryId); 
}