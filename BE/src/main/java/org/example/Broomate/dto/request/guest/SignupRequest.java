package org.example.Broomate.dto.request.guest;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;
import org.example.Broomate.model.Account;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignupRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Schema(description = "User email", example = "john@example.com")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Schema(description = "User password", example = "Password123!")
    private String password;

    @NotBlank(message = "Confirm password is required")
    @Schema(description = "Confirm password", example = "Password123!")
    private String confirmPassword;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @Schema(description = "Full name", example = "John Doe")
    private String name;

    @Schema(description = "Phone number", example = "0901234567")
    private String phone;

    @NotNull(message = "Role is required")
    @Schema(description = "User role", example = "TENANT", allowableValues = {"TENANT", "LANDLORD"})
    private Account.AccountRoleEnum role;
}








