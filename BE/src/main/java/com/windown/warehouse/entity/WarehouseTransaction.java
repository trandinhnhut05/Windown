package com.windown.warehouse.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "warehouse_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private WarehouseItem item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receipt_id")
    private WarehouseReceipt receipt;

    @Column(nullable = false, length = 30)
    private String type; // IMPORT, EXPORT, ADJUST

    @Column(nullable = false, precision = 12, scale = 3)
    private BigDecimal quantity;

    @Column(name = "stock_before", nullable = false, precision = 12, scale = 3)
    private BigDecimal stockBefore;

    @Column(name = "stock_after", nullable = false, precision = 12, scale = 3)
    private BigDecimal stockAfter;

    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;

    @Column(length = 300)
    private String note;

    @PrePersist
    protected void onCreate() {
        if (transactionDate == null) transactionDate = LocalDateTime.now();
    }
}
