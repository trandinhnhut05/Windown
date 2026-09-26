package com.windown.warranty.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record WarrantyResponse(
    Long id,
    Long projectId,
    String projectName,
    LocalDate warrantyDate,
    String issue,
    boolean isResolved,
    LocalDate resolvedAt,
    String note,
    LocalDateTime createdAt
) {}
