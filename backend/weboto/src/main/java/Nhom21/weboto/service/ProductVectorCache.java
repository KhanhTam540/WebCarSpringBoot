package Nhom21.weboto.service;

import Nhom21.weboto.entity.Part;
import Nhom21.weboto.repository.PartRepository;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class ProductVectorCache {

    private final PartRepository partRepository;
    private final VisualFeatureExtractor featureExtractor;
    private final Map<Integer, float[]> vectorMap = new ConcurrentHashMap<>();
    private int indexedCount = 0;
    private int totalCount = 0;
    private boolean isIndexing = false;

    public ProductVectorCache(PartRepository partRepository, VisualFeatureExtractor featureExtractor) {
        this.partRepository = partRepository;
        this.featureExtractor = featureExtractor;
    }

    @PostConstruct
    public void init() {
        // Tự động index khi khởi động
        new Thread(this::indexAllProducts).start();
    }

    public synchronized void indexAllProducts() {
        this.isIndexing = true;
        try {
            // Đợi tối đa 2 phút để model AI sẵn sàng (tải xong)
            int waitTime = 0;
            while (!featureExtractor.isReady() && waitTime < 120) {
                if (featureExtractor.getErrorMessage() != null) {
                    log.error("AI Engine failed to load, aborting indexing.");
                    return;
                }
                Thread.sleep(1000);
                waitTime++;
            }

            if (!featureExtractor.isReady()) {
                log.warn("AI Engine timed out, starting indexing in background anyway.");
            }

            log.info("Bắt đầu trích xuất đặc trưng AI cho tất cả sản phẩm...");
            List<Part> parts = partRepository.findAll();
            this.totalCount = parts.size();
            this.indexedCount = 0;
            
            for (Part part : parts) {
                if (part.getImageUrl() != null && !part.getImageUrl().isBlank()) {
                    try {
                        float[] features = featureExtractor.extractFeatures(part.getImageUrl());
                        vectorMap.put(part.getId(), features);
                        this.indexedCount++;
                    } catch (Exception e) {
                        log.warn("Không thể trích xuất đặc trưng cho sản phẩm {}: URL={}, Lỗi={}", 
                                part.getId(), part.getImageUrl(), e.toString());
                        if (e.getCause() != null) {
                            log.warn("   Nguyên nhân gốc (Root Cause): {}", e.getCause().toString());
                        }
                    }
                }
            }
            log.info("Hoàn tất trích xuất đặc trưng AI. Thành công: {}/{}", indexedCount, totalCount);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            this.isIndexing = false;
        }
    }

    public String getStatus() {
        if (featureExtractor.getErrorMessage() != null) {
            return "Lỗi AI: " + featureExtractor.getErrorMessage();
        }
        if (!featureExtractor.isReady()) {
            return "Đang tải mô hình AI (100MB)...";
        }
        if (isIndexing) {
            return "Đang xử lý dữ liệu: " + indexedCount + "/" + totalCount + " sản phẩm";
        }
        return "AI Sẵn sàng (" + indexedCount + "/" + totalCount + " sản phẩm đã nạp)";
    }

    public List<ScoredResult> findSimilarProducts(float[] inputVector, int topK) {
        if (vectorMap.isEmpty()) {
            return Collections.emptyList();
        }

        List<ScoredResult> results = new ArrayList<>();
        for (Map.Entry<Integer, float[]> entry : vectorMap.entrySet()) {
            double similarity = cosineSimilarity(inputVector, entry.getValue());
            results.add(new ScoredResult(entry.getKey(), similarity));
        }

        // Sắp xếp theo độ tương đồng giảm dần
        results.sort((a, b) -> Double.compare(b.similarity, a.similarity));

        return results.stream().limit(topK).collect(java.util.stream.Collectors.toList());
    }

    private double cosineSimilarity(float[] vectorA, float[] vectorB) {
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;
        for (int i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            normA += Math.pow(vectorA[i], 2);
            normB += Math.pow(vectorB[i], 2);
        }
        if (normA == 0 || normB == 0) return 0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    public static class ScoredResult {
        public Integer productId;
        public double similarity;

        public ScoredResult(Integer productId, double similarity) {
            this.productId = productId;
            this.similarity = similarity;
        }
    }
}
