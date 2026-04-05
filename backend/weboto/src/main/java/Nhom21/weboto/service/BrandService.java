package Nhom21.weboto.service;

import Nhom21.weboto.dto.BrandDTO;
import Nhom21.weboto.entity.Brand;
import Nhom21.weboto.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BrandService {

    @Autowired
    private BrandRepository brandRepository;

    public BrandDTO save(BrandDTO dto) {
        Brand brand = new Brand();
        brand.setName(dto.getName());
        brand.setLogoUrl(dto.getLogoUrl());
        
        Brand savedBrand = brandRepository.save(brand);
        return new BrandDTO(savedBrand.getId(), savedBrand.getName(), savedBrand.getLogoUrl());
    }

    /**
     * Lấy danh sách toàn bộ hãng xe để hiển thị ở trang chủ hoặc bộ lọc [cite: 5, 19]
     */
    public List<BrandDTO> getAllBrands() {
        return brandRepository.findAll().stream()
                .map(brand -> new BrandDTO(brand.getId(), brand.getName(), brand.getLogoUrl()))
                .collect(Collectors.toList());
    }

    public List<BrandDTO> findAll() {
        return brandRepository.findAll().stream()
                .map(brand -> new BrandDTO(brand.getId(), brand.getName(), brand.getLogoUrl()))
                .collect(Collectors.toList());
    }

    @Transactional
    public BrandDTO update(Integer id, BrandDTO dto) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hãng xe ID: " + id));
        brand.setName(dto.getName());
        brand.setLogoUrl(dto.getLogoUrl());
        Brand saved = brandRepository.save(brand);
        return new BrandDTO(saved.getId(), saved.getName(), saved.getLogoUrl());
    }

    public void delete(Integer id) {
        if (!brandRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy hãng xe ID: " + id);
        }
        brandRepository.deleteById(id);
    }
}