package Nhom21.weboto.config;

import Nhom21.weboto.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(request -> {
            var corsConfiguration = new org.springframework.web.cors.CorsConfiguration();
             corsConfiguration.setAllowedOrigins(java.util.List.of(
                 "http://127.0.0.1:5500",
                 "http://localhost:5500",
                 "http://127.0.0.1:5173",
                 "http://localhost:5173",
                 "http://127.0.0.1:4173",
                 "http://localhost:4173"
             ));
            corsConfiguration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
            corsConfiguration.setAllowedHeaders(java.util.List.of("*"));
            corsConfiguration.setAllowCredentials(true);
            return corsConfiguration;
        }))
            .csrf(csrf -> csrf.disable()) // Vô hiệu hóa cho Stateless API
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            .authorizeHttpRequests(auth -> auth
                // 1. NHÓM CÔNG KHAI (Ai cũng xem được để tra cứu phụ tùng)
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/brands/**", "/api/v1/models/**", "/api/v1/model-years/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/categories/**", "/api/v1/parts/**", "/api/v1/combos/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/search/image").permitAll()
                .requestMatchers("/api/v1/orders/lookup/**").permitAll()
                .requestMatchers("/api/v1/payment/vnpay_return", "/api/v1/payment/momo_return").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/api/v1/auth/**", "/error").permitAll() 

                // 2. NHÓM QUẢN TRỊ (Chỉ Admin mới được thay đổi dữ liệu xe/phụ tùng)
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")

                // 3. NHÓM MUA SẮM (Cần đăng nhập - User & Admin đều có giỏ hàng/đơn hàng riêng)
                .requestMatchers("/api/v1/cart/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/api/v1/favorites/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/api/v1/orders/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/v1/compare/**").permitAll()
                .requestMatchers("/api/v1/users/profile/**").hasAnyRole("USER", "ADMIN")
                
                // Các yêu cầu khác
                .anyRequest().authenticated()
            );

        // Thêm Filter kiểm tra JWT
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
            
        return http.build();
    }
}
