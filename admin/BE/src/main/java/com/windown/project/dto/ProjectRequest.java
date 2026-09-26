package com.windown.project.dto;

import com.windown.project.entity.Project.ProjectStatus;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ProjectRequest(
        @NotBlank(message = "Tên công trình không được để trống")
        @Size(max = 200, message = "Tên công trình tối đa 200 ký tự")
        String name,

        @NotBlank(message = "Tên khách hàng không được để trống")
        @Size(max = 100, message = "Tên khách tối đa 100 ký tự")
        String customerName,

        String customerPhone,
        String address,

        @NotNull(message = "Chiều dài không được để trống")
        @DecimalMin(value = "0.01", message = "Chiều dài phải lớn hơn 0")
        BigDecimal lengthM,

        @NotNull(message = "Chiều rộng không được để trống")
        @DecimalMin(value = "0.01", message = "Chiều rộng phải lớn hơn 0")
        BigDecimal widthM,

        @NotNull(message = "Đơn giá không được để trống")
        @DecimalMin(value = "0", message = "Đơn giá không được âm")
        BigDecimal unitPrice,

        @DecimalMin(value = "0", message = "Tiền cọc không được âm")
        BigDecimal deposit,

        ProjectStatus status,
        LocalDate startDate,
        LocalDate deliveryDate,
        String note
) {}
