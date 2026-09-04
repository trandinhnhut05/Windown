package com.windown.warehouse.dto;

import com.windown.warehouse.entity.ItemCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record WarehouseItemRequest(
        String code,
        @NotBlank(message = "Tên vật tư không được để trống") String name,
        ItemCategory category,
        @NotBlank(message = "Đơn vị tính không được để trống") String unit,
        BigDecimal currentStock,
        BigDecimal minStock,
        BigDecimal costPrice,
        BigDecimal sellingPrice,
        String location,
        String note
) {}
