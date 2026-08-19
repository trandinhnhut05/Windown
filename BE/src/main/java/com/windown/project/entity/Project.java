package com.windown.project.entity;

import com.windown.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_code", nullable = false, unique = true, length = 20)
    private String projectCode;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;

    @Column(name = "customer_phone", length = 20)
    private String customerPhone;

    @Column(length = 300)
    private String address;

    @Column(name = "length_m", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal lengthM = BigDecimal.ZERO;

    @Column(name = "width_m", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal widthM = BigDecimal.ZERO;

    @Column(name = "area_m2", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal areaM2 = BigDecimal.ZERO;

    @Column(name = "unit_price", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal unitPrice = BigDecimal.ZERO;

    @Column(name = "total_amount", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "deposit", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal deposit = BigDecimal.ZERO;

    @Column(name = "extra_paid", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal extraPaid = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ProjectStatus status = ProjectStatus.PENDING;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "delivery_date")
    private LocalDate deliveryDate;

    @Column(columnDefinition = "TEXT")
    private String note;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Payment> payments = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        recalculate();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        recalculate();
    }

    public void recalculate() {
        if (lengthM != null && widthM != null) {
            areaM2 = lengthM.multiply(widthM);
        }
        if (areaM2 != null && unitPrice != null) {
            totalAmount = areaM2.multiply(unitPrice);
        }
    }

    public BigDecimal getRemainingDebt() {
        BigDecimal paid = deposit.add(extraPaid);
        return totalAmount.subtract(paid);
    }

    public enum ProjectStatus {
        PENDING,        // Chờ xử lý
        IN_PROGRESS,    // Đang làm
        WAITING_PAYMENT, // Chờ thu tiền
        COMPLETED,      // Hoàn thành
        CANCELLED       // Đã hủy
    }
}
