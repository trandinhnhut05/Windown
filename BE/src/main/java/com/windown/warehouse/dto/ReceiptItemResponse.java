package com.windown.warehouse.dto;

import java.math.BigDecimal;

public record ReceiptItemResponse(
        Long id,
        Long itemId,
        String itemCode,
        String itemName,
        String itemUnit,
        BigDecimal quantity,
        BigDecimal unitPrice,
        BigDecimal totalPrice,
        String note
) {}
