package com.windown.warehouse.dto;

import com.windown.warehouse.entity.ItemCategory;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record WarehouseItemResponse(
        Long id,
        String code,
        String name,
        ItemCategory category,
        String unit,
        BigDecimal currentStock,
        BigDecimal minStock,
        BigDecimal costPrice,
        BigDecimal sellingPrice,
        BigDecimal totalValue,
        String location,
        String note,
        boolean isLowStock,
        Boolean isActive,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
