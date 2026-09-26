package com.windown.material.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MaterialResponse(
        Long id,
        Long projectId,
        String name,
        String unit,
        BigDecimal quantity,
        BigDecimal unitPrice,
        BigDecimal total,
        String note,
        LocalDateTime createdAt
) {}
