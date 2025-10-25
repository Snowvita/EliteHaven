package com.hms.elite_haven.dto;

import java.sql.Timestamp;

import com.hms.elite_haven.dao.entity.HotelEntity;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StaffResponseDto {

    private UserDetailsDto user;

    @NotBlank
    @Size(max = 100)
    private String fullName;

    @NotBlank
    @Email
    @Size(max = 100)
    private String email;

    @NotNull(message = "Phone number is required")
    @Min(value = 1000000000L, message = "Phone number must be at least 6000000000")
    @Max(value = 9999999999L, message = "Phone number must be at most 9999999999")
    private Long phone;

    @NotBlank
    @Size(max = 50)
    private String role;

    private HotelEntity hotelEntity;

    private Timestamp hiredDate;

}
