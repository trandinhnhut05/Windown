package com.windown.warehouse.controller;

import com.windown.warehouse.dto.*;
import com.windown.warehouse.entity.ItemCategory;
import com.windown.warehouse.entity.ReceiptType;
import com.windown.warehouse.service.WarehouseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/warehouse")
@RequiredArgsConstructor
public class WarehouseController {

    private final WarehouseService warehouseService;

    // ========== Vật tư trong kho ==========

    @GetMapping("/items")
    public ResponseEntity<List<WarehouseItemResponse>> getItems(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) ItemCategory category,
            @RequestParam(required = false) Boolean lowStockOnly
    ) {
        return ResponseEntity.ok(warehouseService.getItems(keyword, category, lowStockOnly));
    }

    @GetMapping("/items/{id}")
    public ResponseEntity<WarehouseItemResponse> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(warehouseService.getItemById(id));
    }

    @PostMapping("/items")
    public ResponseEntity<WarehouseItemResponse> createItem(@Valid @RequestBody WarehouseItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(warehouseService.createItem(request));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<WarehouseItemResponse> updateItem(
            @PathVariable Long id,
            @Valid @RequestBody WarehouseItemRequest request
    ) {
        return ResponseEntity.ok(warehouseService.updateItem(id, request));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        warehouseService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    // ========== Phiếu Nhập / Xuất kho ==========

    @GetMapping("/receipts")
    public ResponseEntity<List<WarehouseReceiptResponse>> getReceipts(
            @RequestParam(required = false) ReceiptType type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long projectId
    ) {
        return ResponseEntity.ok(warehouseService.getReceipts(type, startDate, endDate, projectId));
    }

    @GetMapping("/receipts/{id}")
    public ResponseEntity<WarehouseReceiptResponse> getReceiptById(@PathVariable Long id) {
        return ResponseEntity.ok(warehouseService.getReceiptById(id));
    }

    @PostMapping("/receipts")
    public ResponseEntity<WarehouseReceiptResponse> createReceipt(@Valid @RequestBody WarehouseReceiptRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(warehouseService.createReceipt(request));
    }

    // ========== Thẻ kho & Báo cáo ==========

    @GetMapping("/transactions")
    public ResponseEntity<List<WarehouseTransactionResponse>> getTransactions(
            @RequestParam(required = false) Long itemId
    ) {
        return ResponseEntity.ok(warehouseService.getTransactions(itemId));
    }

    @GetMapping("/summary")
    public ResponseEntity<WarehouseSummaryResponse> getSummary() {
        return ResponseEntity.ok(warehouseService.getSummary());
    }
}
