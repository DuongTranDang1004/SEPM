package org.example.Broomate.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class SwaggerConfig {

    // ✅ Optional: Read backend URL from properties
    @Value("${backend.url:http://localhost:8080}")
    private String backendUrl;

    @Bean
    public OpenAPI customOpenAPI() {
        // Define security scheme
        SecurityScheme securityScheme = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
                .in(SecurityScheme.In.HEADER)
                .name("Authorization")
                .description("JWT Authentication");

        // Define security requirement
        SecurityRequirement securityRequirement = new SecurityRequirement()
                .addList("bearerAuth");

        // Define API info
        Info info = new Info()
                .title("Broomate API")
                .description("REST API for Broomate - Roommate Matching Platform")
                .version("1.0.0")
                .contact(new Contact()
                        .name("Broomate Team")
                        .email("support@broomate.com")
                        .url("https://broomate.com"))
                .license(new License()
                        .name("Apache 2.0")
                        .url("https://www.apache.org/licenses/LICENSE-2.0.html"));

        // ✅ Define servers dynamically
        List<Server> servers = new ArrayList<>();

        servers.add(new Server()
                .url("http://localhost:8080")
                .description("Local Development Server"));

       //  ✅ Add your actual backend URL here when deployed
        // Uncomment and update when you deploy:
         servers.add(new Server()
                 .url("https://your-actual-backend-url.com")
                 .description("Production Server"));

        // Build OpenAPI
        return new OpenAPI()
                .openapi("3.1.0")
                .info(info)
                .servers(servers)
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", securityScheme))
                .addSecurityItem(securityRequirement);
    }
}