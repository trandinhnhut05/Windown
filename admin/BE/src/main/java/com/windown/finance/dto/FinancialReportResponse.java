package com.windown.finance.dto;

import java.math.BigDecimal;

public record FinancialReportResponse(
        int month,
        BigDecimal revenue,
        BigDecimal materialCost,
        BigDecimal laborCost,
        BigDecimal generalExpense,
        BigDecimal netProfit
) {}
