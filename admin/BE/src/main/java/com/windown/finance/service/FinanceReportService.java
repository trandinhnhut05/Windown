package com.windown.finance.service;

import com.windown.finance.dto.FinancialReportResponse;
import com.windown.finance.repository.OtherExpenseRepository;
import com.windown.material.repository.MaterialRepository;
import com.windown.project.repository.ProjectRepository;
import com.windown.worker.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FinanceReportService {

    private final ProjectRepository projectRepository;
    private final MaterialRepository materialRepository;
    private final OtherExpenseRepository otherExpenseRepository;
    private final PayrollService payrollService;

    public List<FinancialReportResponse> getAnnualReport(int year) {
        List<FinancialReportResponse> reports = new ArrayList<>();

        for (int month = 1; month <= 12; month++) {
            BigDecimal revenue = projectRepository.sumTotalRevenueByMonth(year, month);
            if (revenue == null) {
                revenue = BigDecimal.ZERO;
            }

            BigDecimal materialCost = materialRepository.sumTotalCostByMonth(year, month);
            if (materialCost == null) {
                materialCost = BigDecimal.ZERO;
            }

            BigDecimal laborCost = payrollService.calculateMonthlyLaborCost(year, month);
            if (laborCost == null) {
                laborCost = BigDecimal.ZERO;
            }

            BigDecimal generalExpense = otherExpenseRepository.sumExpensesByMonth(year, month);
            if (generalExpense == null) {
                generalExpense = BigDecimal.ZERO;
            }

            BigDecimal totalCost = materialCost.add(laborCost).add(generalExpense);
            BigDecimal netProfit = revenue.subtract(totalCost);

            reports.add(new FinancialReportResponse(
                    month,
                    revenue,
                    materialCost,
                    laborCost,
                    generalExpense,
                    netProfit
            ));
        }

        return reports;
    }
}
