package com.windown.worker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record SalaryAdvanceResponse(
        Long id,
        Long workerId,
        String workerName,
        BigDecimal amount,
        LocalDate advanceDate,
        String note,
        LocalDateTime createdAt
) {}
