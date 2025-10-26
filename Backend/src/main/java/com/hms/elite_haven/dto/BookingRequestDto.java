package com.hms.elite_haven.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequestDto {
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotNull(message = "Room ID is required")
    private Long roomId;
    
    @NotNull(message = "Check-in date is required")
    private LocalDate checkInDate;
    
    @NotNull(message = "Check-out date is required")
    private LocalDate checkOutDate;
    
    @NotNull(message = "Number of guests is required")
    private Integer numberOfGuests;
    
    @NotNull(message = "Total price is required")
    private Double totalPrice;
}
