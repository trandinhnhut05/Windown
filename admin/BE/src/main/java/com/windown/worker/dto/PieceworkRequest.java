package com.windown.worker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;

public record PieceworkRequest(
        Long projectId,

        @NotBlank(message = "Mô tả công việc không được để trống")
        String description,

        @NotNull(message = "Số lượng không được để trống")
        @Positive(message = "Số lượng phải lớn hơn 0")
        Double quantity,

        @NotNull(message = "Đơn giá không được để trống")
        BigDecimal unitPrice,

        @NotNull(message = "Ngày thực hiện không được để trống")
        LocalDate workDate
) {}
