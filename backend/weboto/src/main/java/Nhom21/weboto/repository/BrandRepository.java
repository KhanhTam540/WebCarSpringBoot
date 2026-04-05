package Nhom21.weboto.repository;

import Nhom21.weboto.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Integer> {
    // JpaRepository đã hỗ trợ sẵn findAll() để lấy toàn bộ hãng xe
}