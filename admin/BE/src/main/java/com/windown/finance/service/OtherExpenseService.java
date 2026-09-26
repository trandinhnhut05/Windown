package com.windown.finance.service;

import com.windown.common.exception.AppException;
import com.windown.finance.dto.ExpenseRequest;
import com.windown.finance.dto.ExpenseResponse;
import com.windown.finance.entity.OtherExpense;
import com.windown.finance.repository.OtherExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OtherExpenseService {

    private final OtherExpenseRepository expenseRepository;

    public List<ExpenseResponse> getExpensesBetween(LocalDate start, LocalDate end) {
        return expenseRepository.findByExpenseDateBetweenOrderByExpenseDateDesc(start, end).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ExpenseResponse createExpense(ExpenseRequest request) {
        OtherExpense expense = OtherExpense.builder()
                .category(request.category())
                .amount(request.amount())
                .expenseDate(request.expenseDate())
                .description(request.description())
                .build();

        return toResponse(expenseRepository.save(expense));
    }

    @Transactional
    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw AppException.notFound("Không tìm thấy khoản chi phí #" + id);
        }
        expenseRepository.deleteById(id);
    }

    private ExpenseResponse toResponse(OtherExpense e) {
        return new ExpenseResponse(
                e.getId(),
                e.getCategory(),
                e.getAmount(),
                e.getExpenseDate(),
                e.getDescription()
        );
    }
}
