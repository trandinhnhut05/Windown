package com.windown.worker.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record WorkerResponse(
        Long id,
        String name,
        String phone,
        BigDecimal dailyWage,
        boolean isActive,
        String note,
        LocalDateTime createdAt
) {}
