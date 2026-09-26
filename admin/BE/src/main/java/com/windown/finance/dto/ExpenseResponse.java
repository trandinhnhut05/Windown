package com.windown.finance.dto;

import com.windown.finance.entity.ExpenseCategory;
import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseResponse(
        Long id,
        ExpenseCategory category,
        BigDecimal amount,
        LocalDate expenseDate,
        String description
) {}
