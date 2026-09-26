package com.windown.finance.controller;

import com.windown.finance.dto.FinancialReportResponse;
import com.windown.finance.service.FinanceReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/finance")
@RequiredArgsConstructor
public class FinanceReportController {

    private final FinanceReportService financeReportService;

    @GetMapping("/report")
    public ResponseEntity<List<FinancialReportResponse>> getReport(@RequestParam(required = false) Integer year) {
        int targetYear = year == null ? LocalDate.now().getYear() : year;
        return ResponseEntity.ok(financeReportService.getAnnualReport(targetYear));
    }
}
