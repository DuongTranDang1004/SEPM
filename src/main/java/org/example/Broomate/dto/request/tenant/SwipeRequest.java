package org.example.Broomate.dto.request.tenant;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.Broomate.model.Swipe;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SwipeRequest {


    @NotBlank(message = "Target tenant ID is required")
    @Schema(description = "ID of the tenant being swiped on", example = "tenant123")
    private String targetTenantId;

    @NotBlank(message = "Action is required")
    @Pattern(regexp = "ACCEPT|REJECT", message = "Action must be either ACCEPT or REJECT")
    @Schema(description = "Swipe action", example = "ACCEPT")
    private Swipe.SwipeActionEnum swipeAction;
}