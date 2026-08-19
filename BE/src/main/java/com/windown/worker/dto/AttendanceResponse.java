package com.windown.worker.dto;

import java.time.LocalDate;

public record AttendanceResponse(
        Long id,
        Long workerId,
        String workerName,
        LocalDate workDate,
        boolean isPresent,
        String note
) {}
