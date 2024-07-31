package runus.runus.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // 모든 경로에 대해
                        .allowedOrigins("*") // 모든 도메인에서의 요청 허용
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH") // 모든 HTTP 메서드 허용
                        .allowedHeaders("*"); // 모든 헤더 허용
            }

            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                // 파일 업로드 디렉토리 제공 설정
                registry.addResourceHandler("/uploads/**")
                        .addResourceLocations("classpath:/static/uploads/");
            }
        };
    }
}
