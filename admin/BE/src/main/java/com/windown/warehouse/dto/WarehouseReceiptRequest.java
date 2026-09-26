package com.windown.warehouse.dto;

import com.windown.warehouse.entity.ReceiptReason;
import com.windown.warehouse.entity.ReceiptType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public record WarehouseReceiptRequest(
        @NotNull(message = "Loại phiếu không được để trống") ReceiptType type,
        @NotNull(message = "Lý do nhập/xuất không được để trống") ReceiptReason reason,
        Long projectId,
        String supplierOrRecipient,
        LocalDate receiptDate,
        String note,
        @NotEmpty(message = "Danh sách vật tư không được để trống")
        List<@Valid ReceiptItemRequest> items,
        Boolean syncToProjectMaterials // Tùy chọn: tự động thêm vào vật tư công trình nếu là xuất công trình
) {}
