package org.example.Broomate.dto.request.guest;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.Broomate.model.Account;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request to sign up a new user (no avatar in JSON,Avatar will be uploaded as MultipartFile separately)")
public class SignupRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Schema(description = "User email", example = "user@example.com")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @Schema(description = "Password (min 6 characters)", example = "password123")
    private String password;

    @NotBlank(message = "Confirm password is required")
    @Schema(description = "Confirm password", example = "password123")
    private String confirmPassword;

    @NotBlank(message = "Name is required")
    @Schema(description = "User full name", example = "John Doe")
    private String name;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Invalid phone number format")
    @Schema(description = "Phone number", example = "0901234567")
    private String phone;

    @NotNull(message = "Role is required")
    @Schema(description = "Account role", example = "TENANT")
    private Account.AccountRoleEnum role;

    // Avatar will be uploaded as MultipartFile separately
}