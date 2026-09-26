package com.windown.project.dto;

import com.windown.project.entity.Payment;
import com.windown.project.entity.Project.ProjectStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record ProjectResponse(
        Long id,
        String projectCode,
        String name,
        String customerName,
        String customerPhone,
        String address,
        BigDecimal lengthM,
        BigDecimal widthM,
        BigDecimal areaM2,
        BigDecimal unitPrice,
        BigDecimal totalAmount,
        BigDecimal deposit,
        BigDecimal extraPaid,
        BigDecimal remainingDebt,
        BigDecimal materialCost,
        BigDecimal estimatedProfit,
        ProjectStatus status,
        LocalDate startDate,
        LocalDate deliveryDate,
        String note,
        List<PaymentInfo> payments,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public record PaymentInfo(
            Long id,
            BigDecimal amount,
            String type,
            String note,
            LocalDateTime paidAt
    ) {
        public static PaymentInfo from(Payment p) {
            return new PaymentInfo(p.getId(), p.getAmount(), p.getType().name(), p.getNote(), p.getPaidAt());
        }
    }
}
