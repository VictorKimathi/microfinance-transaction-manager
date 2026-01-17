package com.microfinancemanager.microfinancemanager.config;

import org.springframework.context.annotation.Configuration;

/**
 * CORS configuration is now handled in SecurityConfig.java
 * This class is kept for potential future web-specific configurations
 */
@Configuration
public class CorsConfig {
    // CORS is now configured in SecurityConfig via corsConfigurationSource() bean
}

