package Nhom21.weboto.service;

import Nhom21.weboto.dto.CompareResponse;
import Nhom21.weboto.dto.PartDTO;
import Nhom21.weboto.entity.Part;
import Nhom21.weboto.repository.PartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class CompareService {
    private static final List<String> COMPARABLE_FIELDS = List.of("name", "price", "stockQuantity", "categoryName");

    @Autowired
    private PartRepository partRepository;

    public CompareResponse compare(List<Integer> partIds) {
        if (partIds == null || partIds.isEmpty()) {
            throw new RuntimeException("Cần chọn ít nhất một sản phẩm để so sánh");
        }

        if (partIds.size() > 2) {
            throw new RuntimeException("Chỉ hỗ trợ so sánh tối đa 2 sản phẩm");
        }

        List<PartDTO> parts = partIds.stream()
                .map(partId -> partRepository.findById(partId)
                        .map(this::mapToDto)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy phụ tùng ID: " + partId)))
                .toList();

        Map<String, List<String>> comparisonRows = new LinkedHashMap<>();
        comparisonRows.put("name", parts.stream().map(PartDTO::getName).toList());
        comparisonRows.put("price", parts.stream().map(part -> part.getPrice().stripTrailingZeros().toPlainString()).toList());
        comparisonRows.put("stockQuantity", parts.stream().map(part -> String.valueOf(part.getStockQuantity())).toList());
        comparisonRows.put("categoryName", parts.stream().map(part -> String.valueOf(part.getCategoryName())).toList());

        return new CompareResponse(parts, COMPARABLE_FIELDS, comparisonRows);
    }

    private PartDTO mapToDto(Part part) {
        return new PartDTO(
                part.getId(),
                part.getName(),
                part.getSku(),
                part.getDescription(),
                part.getPrice(),
                part.getStockQuantity(),
                part.getImageUrl(),
                part.getCategory() != null ? part.getCategory().getId() : null,
                part.getCategory() != null ? part.getCategory().getName() : null
        );
    }
}
