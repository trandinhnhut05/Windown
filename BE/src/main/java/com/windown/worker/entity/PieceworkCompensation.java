package com.windown.worker.entity;

import com.windown.project.entity.Project;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "piecework_compensations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PieceworkCompensation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(nullable = false, length = 200)
    private String description;

    @Column(nullable = false, columnDefinition = "DECIMAL(10,2)")
    @Builder.Default
    private Double quantity = 1.0;

    @Column(name = "unit_price", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal unitPrice = BigDecimal.ZERO;

    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal amount = BigDecimal.ZERO;

    @Column(name = "work_date", nullable = false)
    private LocalDate workDate;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    @PreUpdate
    protected void onSave() {
        if (quantity != null && unitPrice != null) {
            this.amount = unitPrice.multiply(BigDecimal.valueOf(quantity));
        } else {
            this.amount = BigDecimal.ZERO;
        }
    }
}
