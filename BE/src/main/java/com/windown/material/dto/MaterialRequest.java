package com.windown.material.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record MaterialRequest(
        @NotBlank(message = "Tên vật tư không được để trống")
        @Size(max = 100, message = "Tên vật tư tối đa 100 ký tự")
        String name,

        @NotBlank(message = "Đơn vị tính không được để trống")
        @Size(max = 30, message = "Đơn vị tính tối đa 30 ký tự")
        String unit,

        @NotNull(message = "Số lượng không được để trống")
        @DecimalMin(value = "0.001", message = "Số lượng phải lớn hơn 0")
        BigDecimal quantity,

        @NotNull(message = "Đơn giá không được để trống")
        @DecimalMin(value = "0", message = "Đơn giá không được âm")
        BigDecimal unitPrice,

        @Size(max = 300, message = "Ghi chú tối đa 300 ký tự")
        String note
) {}
