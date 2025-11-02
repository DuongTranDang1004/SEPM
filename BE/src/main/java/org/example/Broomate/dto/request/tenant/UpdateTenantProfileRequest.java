package org.example.Broomate.dto.request.tenant;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.Broomate.model.Tenant;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request to update tenant profile (no avatar)")
public class UpdateTenantProfileRequest {

    @NotBlank(message = "Name is required")
    @Schema(description = "Tenant name", example = "John Doe")
    private String name;

    @Schema(description = "Self description")
    private String description;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Invalid phone number")
    @Schema(description = "Phone number", example = "0901234567")
    private String phone;

    // Human criteria
    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 100, message = "Age must be less than 100")
    @Schema(description = "Age", example = "25")
    private Integer age;

    @NotNull(message = "Gender is required")
    @Schema(description = "Gender", example = "MALE")
    private Tenant.GenderEnum gender;

    @NotNull(message = "Stay length is required")
    @Min(value = 1, message = "Stay length must be at least 1 month")
    @Schema(description = "Stay length in months", example = "6")
    private Integer stayLength;

    @Schema(description = "Move-in date (YYYY-MM-DD)", example = "2025-01-01")
    private String moveInDate;

    @Schema(description = "Is smoking", example = "false")
    private boolean isSmoking;

    @Schema(description = "Is cooking", example = "true")
    private boolean isCooking;

    // Room criteria
    @NotNull(message = "Budget is required")
    @Positive(message = "Budget must be positive")
    @Schema(description = "Monthly budget", example = "5000000")
    private Double budgetPerMonth;

    @Schema(description = "Preferred districts", example = "[\"District 1\", \"District 2\"]")
    private List<String> preferredLocations;

    @Schema(description = "Needs window", example = "true")
    private boolean needWindow;

    @Schema(description = "Might share bedroom", example = "false")
    private boolean mightShareBedRoom;

    @Schema(description = "Might share toilet", example = "true")
    private boolean mightShareToilet;
}