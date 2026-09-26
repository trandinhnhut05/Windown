package com.windown.warehouse.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "warehouse_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 150)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private ItemCategory category = ItemCategory.KHAC;

    @Column(nullable = false, length = 30)
    private String unit;

    @Column(name = "current_stock", nullable = false, precision = 12, scale = 3)
    @Builder.Default
    private BigDecimal currentStock = BigDecimal.ZERO;

    @Column(name = "min_stock", nullable = false, precision = 12, scale = 3)
    @Builder.Default
    private BigDecimal minStock = BigDecimal.ZERO;

    @Column(name = "cost_price", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal costPrice = BigDecimal.ZERO;

    @Column(name = "selling_price", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal sellingPrice = BigDecimal.ZERO;

    @Column(length = 100)
    private String location;

    @Column(length = 300)
    private String note;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (currentStock == null) currentStock = BigDecimal.ZERO;
        if (minStock == null) minStock = BigDecimal.ZERO;
        if (costPrice == null) costPrice = BigDecimal.ZERO;
        if (sellingPrice == null) sellingPrice = BigDecimal.ZERO;
        if (isActive == null) isActive = true;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
