package Nhom21.weboto.service;

import Nhom21.weboto.config.FileStorageProperties;
import Nhom21.weboto.dto.ImageSearchResponse;
import Nhom21.weboto.dto.ImageSearchResultItem;
import Nhom21.weboto.entity.Category;
import Nhom21.weboto.entity.Part;
import Nhom21.weboto.entity.SearchHistory;
import Nhom21.weboto.repository.CategoryRepository;
import Nhom21.weboto.repository.PartRepository;
import Nhom21.weboto.repository.SearchHistoryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ImageSearchService {

    private final PartRepository partRepository;
    private final CategoryRepository categoryRepository;
    private final SearchHistoryRepository searchHistoryRepository;
    private final FileStorageProperties fileStorageProperties;
    private final VisualFeatureExtractor featureExtractor;
    private final ProductVectorCache productVectorCache;

    public ImageSearchService(
            PartRepository partRepository,
            CategoryRepository categoryRepository,
            SearchHistoryRepository searchHistoryRepository,
            FileStorageProperties fileStorageProperties,
            VisualFeatureExtractor featureExtractor,
            ProductVectorCache productVectorCache
    ) {
        this.partRepository = partRepository;
        this.categoryRepository = categoryRepository;
        this.searchHistoryRepository = searchHistoryRepository;
        this.fileStorageProperties = fileStorageProperties;
        this.featureExtractor = featureExtractor;
        this.productVectorCache = productVectorCache;
    }

    @Transactional
    public ImageSearchResponse searchByImage(MultipartFile file) {
        validateFile(file);
        cleanupOldFilesBestEffort();

        String storedImageUrl = storeFile(file);
        
        List<ImageSearchResultItem> suggestions = new ArrayList<>();
        String matchedTag = null;
        Boolean isAiResult = false;
        String status = "AI_INITIALIZING";
        
        try {
            float[] queryVector = featureExtractor.extractFeatures(file.getInputStream());
            List<ProductVectorCache.ScoredResult> scoredResults = productVectorCache.findSimilarProducts(queryVector, 20);
            
            // Lọc theo ngưỡng tương đồng (Threshold: 0.45)
            List<ProductVectorCache.ScoredResult> topMatches = scoredResults.stream()
                    .filter(r -> r.similarity >= 0.45)
                    .limit(12)
                    .collect(Collectors.toList());

            if (!topMatches.isEmpty()) {
                List<Integer> similarIds = topMatches.stream().map(r -> r.productId).collect(Collectors.toList());
                List<Part> parts = partRepository.findAllById(similarIds);
                Map<Integer, Part> partMap = parts.stream().collect(Collectors.toMap(Part::getId, p -> p));
                Map<Integer, Double> scoreMap = topMatches.stream().collect(Collectors.toMap(r -> r.productId, r -> r.similarity));
                
                suggestions = topMatches.stream()
                        .map(r -> partMap.get(r.productId))
                        .filter(Objects::nonNull)
                        .map(p -> mapToResultItem(p, scoreMap.get(p.getId())))
                        .collect(Collectors.toList());
                
                if (!suggestions.isEmpty() && suggestions.get(0).getCategoryName() != null) {
                    matchedTag = suggestions.get(0).getCategoryName();
                }
                isAiResult = true;
                status = "SUCCESS";
            } else {
                status = "LOW_CONFIDENCE";
                throw new Exception("No high confidence visual match found");
            }
        } catch (Exception e) {
            log.info("AI Search not available or low confidence, falling back to keywords: {}", e.getMessage());
            String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "";
            List<String> keywords = extractKeywords(originalName);
            
            // Chỉ thực hiện fallback nếu từ khóa không rỗng và không phải tên tệp rác
            if (!keywords.isEmpty()) {
                Category matchedCategory = findBestMatchingCategory(keywords);
                matchedTag = matchedCategory != null ? matchedCategory.getName() : keywords.get(0);
                List<Part> legacySuggestions = findSmartSuggestions(keywords, matchedCategory);
                suggestions = legacySuggestions.stream().map(p -> mapToResultItem(p, null)).collect(Collectors.toList());
                status = "FALLBACK_KEYWORD";
            } else {
                status = suggestions.isEmpty() ? "NOT_FOUND" : status;
            }
        }

        // 4. Lưu lịch sử
        SearchHistory history = new SearchHistory();
        history.setSearchType("image");
        history.setQuery(storedImageUrl);
        history.setFilters("{\"ai_enabled\":" + isAiResult + ",\"status\":\"" + status + "\"}");
        history.setResultsCount(suggestions.size());
        searchHistoryRepository.save(history);

        return new ImageSearchResponse(
                storedImageUrl,
                matchedTag,
                isAiResult,
                status,
                productVectorCache.getStatus(),
                suggestions
        );
    }

    private List<String> extractKeywords(String filename) {
        if (filename == null || filename.isBlank()) return Collections.emptyList();
        
        // Loại bỏ phần mở rộng và chuẩn hóa
        String nameWithoutExt = filename.substring(0, filename.lastIndexOf('.') > 0 ? filename.lastIndexOf('.') : filename.length());
        String normalized = nameWithoutExt.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9\\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]", " ")
                .trim();
        
        // Tách từ và loại bỏ từ vô nghĩa (stop words)
        // Thêm "images", "photo", "img" để tránh fallback rác từ tên tệp
        Set<String> stopWords = Set.of("anh", "image", "images", "img", "photo", "pic", "jpg", "png", "jpeg", "search", "upload", "hinh", "cua", "cho", "va");
        return Arrays.stream(normalized.split("\\s+"))
                .filter(word -> word.length() > 1 && !stopWords.contains(word))
                .distinct()
                .collect(Collectors.toList());
    }

    private Category findBestMatchingCategory(List<String> keywords) {
        if (keywords.isEmpty()) return null;
        
        List<Category> allCategories = categoryRepository.findAll();
        for (String keyword : keywords) {
            for (Category category : allCategories) {
                String catName = category.getName().toLowerCase(Locale.ROOT);
                if (catName.contains(keyword) || keyword.contains(catName)) {
                    return category;
                }
            }
        }
        return null;
    }

    private List<Part> findSmartSuggestions(List<String> keywords, Category matchedCategory) {
        Set<Part> resultSet = new LinkedHashSet<>(); // Giữ thứ tự và duy nhất

        // Ưu tiên 1: Tìm theo danh mục nếu nhận diện được
        if (matchedCategory != null) {
            List<Part> catParts = partRepository.findByCategoryId(matchedCategory.getId());
            resultSet.addAll(catParts.stream().limit(10).collect(Collectors.toList()));
        }

        // Ưu tiên 2: Tìm kiếm theo từng từ khóa quan trọng
        for (String keyword : keywords) {
            if (resultSet.size() >= 12) break;
            List<Part> keywordParts = partRepository.findByNameContainingIgnoreCase(keyword);
            resultSet.addAll(keywordParts.stream().limit(5).collect(Collectors.toList()));
        }

        // Ưu tiên 3: Nếu vẫn ít quá, lấy sản phẩm ngẫu nhiên/mới nhất
        if (resultSet.size() < 4) {
            resultSet.addAll(partRepository.findAll().stream().limit(10).collect(Collectors.toList()));
        }

        return resultSet.stream().limit(12).collect(Collectors.toList());
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Vui lòng chọn ảnh để tìm kiếm");
        }
        if (file.getSize() > fileStorageProperties.getMaxFileSizeBytes()) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "Kích thước tệp vượt quá giới hạn");
        }
    }

    private String storeFile(MultipartFile file) {
        try {
            String extension = extractExtension(Objects.requireNonNull(file.getOriginalFilename()));
            Path targetDir = Paths.get(fileStorageProperties.getRootDir(), "image-search");
            Files.createDirectories(targetDir);

            String fileName = UUID.randomUUID() + extension;
            Files.copy(file.getInputStream(), targetDir.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/image-search/" + fileName;
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi lưu tệp");
        }
    }

    private ImageSearchResultItem mapToResultItem(Part part, Double score) {
        return new ImageSearchResultItem(
                part.getId(),
                part.getSku(),
                part.getName(),
                part.getPrice() != null ? part.getPrice() : BigDecimal.ZERO,
                part.getStockQuantity(),
                part.getImageUrl(),
                part.getCategory() != null ? part.getCategory().getId() : null,
                part.getCategory() != null ? part.getCategory().getName() : "Chưa phân loại",
                score
        );
    }

    private void cleanupOldFilesBestEffort() {
        try {
            Path targetDir = Paths.get(fileStorageProperties.getRootDir(), "image-search");
            if (!Files.exists(targetDir)) return;
            Instant threshold = Instant.now().minus(fileStorageProperties.getRetentionHours(), ChronoUnit.HOURS);
            try (var files = Files.list(targetDir)) {
                files.filter(Files::isRegularFile)
                     .filter(p -> {
                         try { return Files.getLastModifiedTime(p).toInstant().isBefore(threshold); }
                         catch (IOException e) { return false; }
                     })
                     .forEach(p -> { try { Files.deleteIfExists(p); } catch (IOException ignored) {} });
            }
        } catch (IOException ignored) {}
    }

    private String extractExtension(String filename) {
        int dotIdx = filename.lastIndexOf('.');
        return dotIdx < 0 ? ".jpg" : filename.substring(dotIdx);
    }
}
