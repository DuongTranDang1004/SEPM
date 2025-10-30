package org.example.Broomate.dto.request.tenant;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateTenantProfileRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @Schema(description = "Tenant name", example = "John Doe")
    private String name;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    @Schema(description = "Profile description", example = "25 years old, software engineer")
    private String description;

    @Schema(description = "Avatar URL", example = "https://example.com/avatar.jpg")
    private String avatar;

    @NotNull(message = "Budget per month is required")
    @Min(value = 0, message = "Budget must be positive")
    @Schema(description = "Monthly budget in VND", example = "5000000")
    private Double budgetPerMonth;

    @NotNull(message = "Stay length is required")
    @Min(value = 1, message = "Stay length must be at least 1 month")
    @Max(value = 24, message = "Stay length cannot exceed 24 months")
    @Schema(description = "Stay length in months", example = "12")
    private Integer stayLength;

    @NotBlank(message = "Move-in date is required")
    @Schema(description = "Move-in date", example = "2025-12-01")
    private String moveInDate;

    @NotEmpty(message = "At least one preferred location is required")
    @Schema(description = "Preferred districts", example = "[\"District 1\", \"District 2\"]")
    private List<String> preferredLocations;

    @Schema(description = "Phone number", example = "0901234567")
    private String phone;
}