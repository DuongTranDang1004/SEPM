package org.example.Broomate.dto.response.guest;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;



import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.Broomate.model.Account;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Authentication response")
public class AuthResponse {

    @Schema(description = "JWT token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String token;

    @Schema(description = "User ID", example = "user123")
    private String userId;

    @Schema(description = "Email", example = "john@example.com")
    private String email;

    @Schema(description = "Full name", example = "John Doe")
    private String name;

    @Schema(description = "User role. Must be TENANT or LANDLORD", example = "TENANT")
    private Account.AccountRoleEnum role;

    @Schema(description = "Response message", example = "Login successful")
    private String message;
}