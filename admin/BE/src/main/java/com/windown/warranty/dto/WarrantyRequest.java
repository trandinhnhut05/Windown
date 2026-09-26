package com.windown.warranty.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record WarrantyRequest(
    @NotNull(message = "Ngày bảo hành không được để trống")
    LocalDate warrantyDate,

    @NotBlank(message = "Nội dung sự cố không được để trống")
    String issue,

    Boolean isResolved,
    LocalDate resolvedAt,
    String note
) {}
