package com.windown.worker.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record WorkerRequest(
        @NotBlank(message = "Tên thợ không được để trống")
        @Size(max = 100, message = "Tên thợ tối đa 100 ký tự")
        String name,

        @Size(max = 20, message = "SĐT tối đa 20 ký tự")
        String phone,

        @NotNull(message = "Lương ngày không được để trống")
        @DecimalMin(value = "0", message = "Lương ngày không được âm")
        BigDecimal dailyWage,

        Boolean isActive,

        @Size(max = 300, message = "Ghi chú tối đa 300 ký tự")
        String note
) {}
