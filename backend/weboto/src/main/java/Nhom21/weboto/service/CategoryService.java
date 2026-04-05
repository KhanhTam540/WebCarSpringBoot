package Nhom21.weboto.service;

import Nhom21.weboto.dto.CategoryDTO;
import Nhom21.weboto.entity.Category;
import Nhom21.weboto.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    /**
     * Lưu danh mục mới (Dùng cho Admin CRUD)
     */
    public CategoryDTO save(CategoryDTO dto) {
        Category category = new Category();
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        
        Category savedCategory = categoryRepository.save(category);
        return new CategoryDTO(savedCategory.getId(), savedCategory.getName(), savedCategory.getDescription());
    }

    /**
     * Lấy toàn bộ danh mục phục vụ tra cứu
     */
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(cat -> new CategoryDTO(cat.getId(), cat.getName(), cat.getDescription()))
                .collect(Collectors.toList());
    }

    public List<CategoryDTO> findAll() {
        return categoryRepository.findAll().stream()
                .map(cat -> new CategoryDTO(cat.getId(), cat.getName(), cat.getDescription()))
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryDTO update(Integer id, CategoryDTO dto) {
        Category cat = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục"));
        cat.setName(dto.getName());
        cat.setDescription(dto.getDescription());
        Category saved = categoryRepository.save(cat);
        return new CategoryDTO(saved.getId(), saved.getName(), saved.getDescription());
    }

    public void delete(Integer id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy danh mục ID: " + id);
        }
        categoryRepository.deleteById(id);
    }
}