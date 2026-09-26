package com.windown.project.dto;

import java.math.BigDecimal;

public record DashboardStats(
        long totalProjects,
        long inProgressProjects,
        long completedProjects,
        long waitingPaymentProjects,
        BigDecimal totalRevenue,
        BigDecimal totalDebt,
        BigDecimal totalPaid
) {}
