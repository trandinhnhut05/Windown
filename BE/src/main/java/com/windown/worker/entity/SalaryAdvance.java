package com.windown.worker.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "salary_advances")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalaryAdvance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal amount = BigDecimal.ZERO;

    @Column(name = "advance_date", nullable = false)
    private LocalDate advanceDate;

    @Column(length = 300)
    private String note;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
