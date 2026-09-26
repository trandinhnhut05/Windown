package com.windown.material.dto;

import java.math.BigDecimal;

public record FinancialChartResponse(
        String month,
        BigDecimal revenue,
        BigDecimal materialCost,
        BigDecimal profit
) {}
