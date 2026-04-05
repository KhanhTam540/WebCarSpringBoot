package Nhom21.weboto.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebStaticConfig implements WebMvcConfigurer {

    @Autowired
    private FileStorageProperties fileStorageProperties;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadPath = Paths.get(fileStorageProperties.getRootDir()).toAbsolutePath().toUri().toString();
        
        // Map /uploads/** URL pattern to the physical directory on the filesystem
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath);
    }
}
