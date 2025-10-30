package org.example.Broomate.dto.request.landlord;

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
public class CreateRoomRequest {


    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    @Schema(description = "Room title", example = "Spacious 2BR Apartment in District 1")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 20, max = 2000, message = "Description must be between 20 and 2000 characters")
    @Schema(description = "Room description", example = "Beautiful apartment with modern amenities")
    private String description;

    @Schema(description = "Thumbnail URL", example = "https://example.com/thumb.jpg")
    private String thumbnailUrl;

    @Schema(description = "Image URLs")
    private List<String> imageUrls;

    @Schema(description = "Video URLs")
    private List<String> videoUrls;

    @Schema(description = "Document URLs (PDFs, contracts)")
    private List<String> documentUrls;

    @NotNull(message = "Rent price is required")
    @Min(value = 0, message = "Rent price must be positive")
    @Schema(description = "Rent price per month", example = "5000000")
    private Double rentPricePerMonth;

    @NotNull(message = "Minimum stay is required")
    @Min(value = 1, message = "Minimum stay must be at least 1 month")
    @Max(value = 24, message = "Minimum stay cannot exceed 24 months")
    @Schema(description = "Minimum stay in months", example = "6")
    private Integer minimumStayMonths;

    @NotBlank(message = "Address is required")
    @Schema(description = "Full address", example = "123 Nguyen Hue, District 1, HCMC")
    private String address;

    @Schema(description = "Latitude", example = "10.7769")
    private Double latitude;

    @Schema(description = "Longitude", example = "106.7009")
    private Double longitude;

    @NotNull(message = "Number of toilets is required")
    @Min(value = 1, message = "Must have at least 1 toilet")
    @Schema(description = "Number of toilets", example = "2")
    private Integer numberOfToilets;
}

