package com.hms.elite_haven.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordDto {

    @NotNull
    private Long userId;

    @NotBlank
    @Size(min = 8, max = 24)
    private String oldPassword;

    @NotBlank
    @Size(min = 8, max = 24)
    private String newPassword;

    @NotBlank
    @Size(min = 8, max = 24)
    private String confirmNewPassword;
}
