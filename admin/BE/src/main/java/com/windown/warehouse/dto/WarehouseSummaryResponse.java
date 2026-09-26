package com.windown.warehouse.dto;

import java.math.BigDecimal;

public record WarehouseSummaryResponse(
        long totalItems,
        BigDecimal totalStockValue,
        long lowStockItemsCount,
        long totalImportsThisMonth,
        BigDecimal totalImportValueThisMonth,
        long totalExportsThisMonth,
        BigDecimal totalExportValueThisMonth
) {}
