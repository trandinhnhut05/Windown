package com.windown.warehouse.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record WarehouseTransactionResponse(
        Long id,
        Long itemId,
        String itemCode,
        String itemName,
        String itemUnit,
        Long receiptId,
        String receiptCode,
        String type,
        BigDecimal quantity,
        BigDecimal stockBefore,
        BigDecimal stockAfter,
        LocalDateTime transactionDate,
        String note
) {}
