package com.windown.worker.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record SalaryAdvanceRequest(
        @NotNull(message = "Số tiền ứng không được để trống")
        @DecimalMin(value = "1000", message = "Số tiền ứng tối thiểu 1.000 đ")
        BigDecimal amount,

        @NotNull(message = "Ngày ứng lương không được để trống")
        LocalDate advanceDate,

        @Size(max = 300, message = "Ghi chú tối đa 300 ký tự")
        String note
) {}
