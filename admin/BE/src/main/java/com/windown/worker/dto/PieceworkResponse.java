package com.windown.worker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PieceworkResponse(
        Long id,
        Long workerId,
        String workerName,
        Long projectId,
        String projectCode,
        String projectName,
        String description,
        Double quantity,
        BigDecimal unitPrice,
        BigDecimal amount,
        LocalDate workDate
) {}
