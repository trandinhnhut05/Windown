package com.windown.material.dto;

import java.math.BigDecimal;

public record MaterialTemplateResponse(
        Long id,
        String name,
        String unit,
        BigDecimal defaultPrice
) {}
