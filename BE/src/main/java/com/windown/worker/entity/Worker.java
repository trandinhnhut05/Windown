package com.windown.worker.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "workers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Worker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 20)
    private String phone;

    @Column(name = "daily_wage", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal dailyWage = BigDecimal.ZERO;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;

    @Column(length = 300)
    private String note;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
