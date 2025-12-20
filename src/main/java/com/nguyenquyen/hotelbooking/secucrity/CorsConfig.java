package com.nguyenquyen.hotelbooking.secucrity;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;


@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedOrigins("*");

            }
            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                String uploadDir = "file:" + Paths.get("uploads").toAbsolutePath().toString();
                registry.addResourceHandler("/uploads/**")
                        .addResourceLocations(uploadDir + "/");
            }

        };
    }

}

