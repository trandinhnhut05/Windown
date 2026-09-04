package com.windown.warehouse.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record ReceiptItemRequest(
        @NotNull(message = "Vui lòng chọn vật tư") Long itemId,
        @NotNull(message = "Số lượng không được để trống")
        @DecimalMin(value = "0.001", message = "Số lượng phải lớn hơn 0")
        BigDecimal quantity,
        BigDecimal unitPrice,
        String note
) {}
