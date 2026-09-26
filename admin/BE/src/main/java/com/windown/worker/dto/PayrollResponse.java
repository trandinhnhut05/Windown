package com.windown.worker.dto;

import java.math.BigDecimal;

public record PayrollResponse(
        Long workerId,
        String workerName,
        BigDecimal dailyWage,
        Double presentDays,
        Double totalOtHours,
        BigDecimal totalEarnedFromAttendance,
        BigDecimal totalPieceworkAmount,
        BigDecimal totalEarned,
        BigDecimal totalAdvanced,
        BigDecimal remainingSalary
) {}
