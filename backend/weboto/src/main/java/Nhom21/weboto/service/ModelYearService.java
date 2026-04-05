package Nhom21.weboto.service;

import Nhom21.weboto.dto.ModelYearDTO;
import Nhom21.weboto.entity.CarModel;
import Nhom21.weboto.entity.ModelYear;
import Nhom21.weboto.repository.CarModelRepository;
import Nhom21.weboto.repository.ModelYearRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ModelYearService {

    @Autowired
    private ModelYearRepository modelYearRepository;

    /**
     * Lấy danh sách đời xe (năm) dựa theo ID của dòng xe [cite: 7]
     */
    public List<ModelYearDTO> getYearsByModel(Integer modelId) {
    return modelYearRepository.findByCarModelId(modelId).stream()
            .map(year -> new ModelYearDTO(year.getId(), year.getYearNumber(), year.getCarModel().getId(), null)) // Dùng getter mới
            .collect(Collectors.toList());
    }

    @Autowired
    private CarModelRepository carModelRepository; // Cần inject để tìm Dòng xe cha

    public ModelYearDTO save(ModelYearDTO dto) {
        // 1. Tìm Dòng xe dựa trên modelId
        CarModel carModel = carModelRepository.findById(dto.getModelId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Dòng xe ID: " + dto.getModelId()));
        
        // 2. Chuyển DTO sang Entity
        ModelYear modelYear = new ModelYear();
        modelYear.setYearNumber(dto.getYearNumber());
        modelYear.setCarModel(carModel);
        
        // 3. Lưu và trả về DTO
        ModelYear savedYear = modelYearRepository.save(modelYear);
        return new ModelYearDTO(savedYear.getId(), savedYear.getYearNumber(), savedYear.getCarModel().getId(), null);
    }

    public List<ModelYearDTO> findAll() {
        return modelYearRepository.findAll().stream()
                .map(year -> new ModelYearDTO(year.getId(), year.getYearNumber(), year.getCarModel().getId(), null))
                .collect(Collectors.toList());
    }

    @Transactional
    public ModelYearDTO update(Integer id, ModelYearDTO dto) {
        ModelYear year = modelYearRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đời xe"));
        CarModel model = carModelRepository.findById(dto.getModelId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dòng xe mới"));

        year.setYearNumber(dto.getYearNumber());
        year.setCarModel(model);
        ModelYear saved = modelYearRepository.save(year);
        return new ModelYearDTO(saved.getId(), saved.getYearNumber(), saved.getCarModel().getId(), null);
    }
    // Trong file ModelYearService.java
public List<ModelYearDTO> getAllYears() {
    List<ModelYear> years = modelYearRepository.findAll();
    return years.stream().map(y -> {
        ModelYearDTO dto = new ModelYearDTO();
        dto.setId(y.getId());
        dto.setYearNumber(y.getYearNumber());
        
        if (y.getCarModel() != null) {
            dto.setModelId(y.getCarModel().getId());
            // SỬA: Thay y.getCarModel().getName() thành y.getCarModel().getModelName()
            dto.setModelName(y.getCarModel().getModelName());
        }
        return dto;
    }).collect(Collectors.toList());
}

    public void delete(Integer id) {
        if (!modelYearRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy đời xe ID: " + id);
        }
        modelYearRepository.deleteById(id);
    }
}