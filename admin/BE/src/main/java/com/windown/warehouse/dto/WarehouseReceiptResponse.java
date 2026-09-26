package com.windown.warehouse.dto;

import com.windown.warehouse.entity.ReceiptReason;
import com.windown.warehouse.entity.ReceiptType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record WarehouseReceiptResponse(
        Long id,
        String code,
        ReceiptType type,
        ReceiptReason reason,
        Long projectId,
        String projectCode,
        String projectName,
        String supplierOrRecipient,
        LocalDate receiptDate,
        BigDecimal totalAmount,
        String note,
        String createdByName,
        LocalDateTime createdAt,
        List<ReceiptItemResponse> items
) {}
