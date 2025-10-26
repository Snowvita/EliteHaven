package com.hms.elite_haven.dto;

import com.hms.elite_haven.utils.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDto {
    private Long bookingId;
    private Double amount;
    private PaymentMethod paymentMethod;
}