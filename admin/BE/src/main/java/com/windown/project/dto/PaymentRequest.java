package com.windown.project.dto;

import com.windown.project.entity.Payment.PaymentType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentRequest(
        @NotNull(message = "Số tiền không được để trống")
        @DecimalMin(value = "1000", message = "Số tiền phải ít nhất 1.000 VND")
        BigDecimal amount,

        @NotNull(message = "Loại thanh toán không được để trống")
        PaymentType type,

        String note,
        LocalDateTime paidAt
) {}
