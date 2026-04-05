package Nhom21.weboto.service;

import ai.djl.Application;
import ai.djl.ModelException;
import ai.djl.inference.Predictor;
import ai.djl.modality.cv.Image;
import ai.djl.modality.cv.ImageFactory;
import ai.djl.modality.cv.transform.Normalize;
import ai.djl.modality.cv.transform.Resize;
import ai.djl.modality.cv.transform.ToTensor;
import ai.djl.repository.zoo.Criteria;
import ai.djl.repository.zoo.ModelZoo;
import ai.djl.repository.zoo.ZooModel;
import ai.djl.translate.Pipeline;
import ai.djl.translate.TranslateException;
import ai.djl.translate.Translator;
import ai.djl.translate.TranslatorContext;
import ai.djl.ndarray.NDList;
import ai.djl.ndarray.types.Shape;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.time.Duration;

@Service
public class VisualFeatureExtractor {

    private ZooModel<Image, float[]> model;

    private boolean isReady = false;
    private String errorMessage = null;

    @PostConstruct
    public void init() {
        new Thread(() -> {
            try {
                System.out.println("AI Engine: Loading ResNet50 model (approx 100MB)...");
                // Pipeline xử lý ảnh cho ResNet
                Pipeline pipeline = new Pipeline();
                pipeline.add(new Resize(224, 224))
                        .add(new ToTensor())
                        .add(new Normalize(
                                new float[]{0.485f, 0.456f, 0.406f},
                                new float[]{0.229f, 0.224f, 0.225f}));

                // Translator để chuyển đổi từ Image sang float[] (embeddings)
                Translator<Image, float[]> translator = new Translator<>() {
                    @Override
                    public NDList processInput(TranslatorContext ctx, Image input) {
                        return pipeline.transform(new NDList(input.toNDArray(ctx.getNDManager())));
                    }

                    @Override
                    public float[] processOutput(TranslatorContext ctx, NDList list) {
                        return list.get(0).squeeze().toFloatArray();
                    }
                };

                Criteria<Image, float[]> criteria = Criteria.builder()
                        .setTypes(Image.class, float[].class)
                        .optApplication(Application.CV.IMAGE_CLASSIFICATION)
                        .optEngine("PyTorch")
                        .optFilter("layers", "50")
                        .optTranslator(translator)
                        .build();

                this.model = criteria.loadModel();
                this.isReady = true;
                System.out.println("AI Engine: Model loaded successfully.");
            } catch (Exception e) {
                this.errorMessage = e.getMessage();
                System.err.println("AI Engine: Model failed to load: " + e.getMessage());
                e.printStackTrace();
            }
        }).start();
    }

    public boolean isReady() {
        return isReady;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public float[] extractFeatures(InputStream is) throws IOException, TranslateException {
        Image image = ImageFactory.getInstance().fromInputStream(is);
        try (Predictor<Image, float[]> predictor = model.newPredictor()) {
            return predictor.predict(image);
        }
    }

    public float[] extractFeatures(String imageUrl) throws IOException, TranslateException {
        if (imageUrl == null || imageUrl.isBlank()) {
            throw new IOException("Image URL is null or empty");
        }
        String trimmedUrl = imageUrl.trim();
        try (InputStream is = fetchInputStreamFromUrl(trimmedUrl)) {
            return extractFeatures(is);
        } catch (Exception e) {
            throw new IOException("Failed to load image from URL: " + trimmedUrl, e);
        }
    }

    private InputStream fetchInputStreamFromUrl(String url) throws Exception {
        // Xử lý mã hóa URL (Hỗ trợ ký tự đặc biệt)
        java.net.URL urlObj = new java.net.URL(url);
        java.net.URI uri = new java.net.URI(urlObj.getProtocol(), urlObj.getUserInfo(), urlObj.getHost(), urlObj.getPort(), urlObj.getPath(), urlObj.getQuery(), urlObj.getRef());

        // Cấu hình bỏ qua xác thực SSL (Trust All) để tránh lỗi chứng chỉ trên Docker/Local
        TrustManager[] trustAllCerts = new TrustManager[]{
            new X509TrustManager() {
                public X509Certificate[] getAcceptedIssuers() { return null; }
                public void checkClientTrusted(X509Certificate[] certs, String authType) {}
                public void checkServerTrusted(X509Certificate[] certs, String authType) {}
            }
        };

        SSLContext sslContext = SSLContext.getInstance("TLS");
        sslContext.init(null, trustAllCerts, new SecureRandom());

        HttpClient client = HttpClient.newBuilder()
                .sslContext(sslContext)
                .connectTimeout(Duration.ofSeconds(15))
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(uri)
                .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36")
                .header("Accept", "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8")
                .timeout(Duration.ofSeconds(30))
                .build();

        try {
            HttpResponse<InputStream> response = client.send(request, HttpResponse.BodyHandlers.ofInputStream());
            
            if (response.statusCode() != 200) {
                System.err.println("AI Engine Fetch Error: HTTP " + response.statusCode() + " for URL: " + url);
                throw new IOException("HTTP " + response.statusCode());
            }
            
            return response.body();
        } catch (Exception e) {
            System.err.println("AI Engine Network Error for URL [" + url + "]: " + e.toString());
            throw e;
        }
    }

    @PreDestroy
    public void close() {
        if (model != null) {
            model.close();
        }
    }
}
