package com.windown.worker.controller;

import com.windown.worker.dto.PayrollResponse;
import com.windown.worker.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @GetMapping
    public ResponseEntity<List<PayrollResponse>> getPayroll(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month
    ) {
        int targetYear = year == null ? LocalDate.now().getYear() : year;
        int targetMonth = month == null ? LocalDate.now().getMonthValue() : month;
        return ResponseEntity.ok(payrollService.calculateMonthlyPayroll(targetYear, targetMonth));
    }
}
