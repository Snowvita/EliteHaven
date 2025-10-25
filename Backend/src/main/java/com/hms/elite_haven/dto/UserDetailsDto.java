package com.hms.elite_haven.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailsDto {

    private Long userId; // Not updatable, just for reference

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name can be at most 100 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 100, message = "Email can be at most 100 characters")
    private String email;

    @NotNull(message = "Phone number is required")
    @Min(value = 1000000000L, message = "Phone number must be at least 6000000000")
    @Max(value = 9999999999L, message = "Phone number must be at most 9999999999")
    private Long phoneNumber;

    @Size(max = 50, message = "Role can be at most 50 characters")
    private String role; // CUSTOMER, STAFF, ADMIN
}
