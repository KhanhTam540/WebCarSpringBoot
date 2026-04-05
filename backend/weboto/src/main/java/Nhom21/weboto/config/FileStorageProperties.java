package Nhom21.weboto.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.file-storage")
public class FileStorageProperties {
    private String rootDir = "uploads";
    private long maxFileSizeBytes = 5_242_880;
    private String[] allowedMimeTypes = new String[] {"image/jpeg", "image/png", "image/webp"};
    private long retentionHours = 24;
}
