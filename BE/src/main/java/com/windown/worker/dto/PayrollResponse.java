package com.windown.worker.dto;

import java.math.BigDecimal;

public record PayrollResponse(
        Long workerId,
        String workerName,
        BigDecimal dailyWage,
        long presentDays,
        BigDecimal totalEarned,
        BigDecimal totalAdvanced,
        BigDecimal remainingSalary
) {}
