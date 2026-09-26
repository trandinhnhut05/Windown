package com.windown.finance.dto;

import com.windown.finance.entity.ExpenseCategory;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseRequest(
        @NotNull(message = "Danh mục chi phí không được để trống")
        ExpenseCategory category,

        @NotNull(message = "Số tiền không được để trống")
        @Positive(message = "Số tiền chi phải lớn hơn 0")
        BigDecimal amount,

        @NotNull(message = "Ngày chi không được để trống")
        LocalDate expenseDate,

        String description
) {}
