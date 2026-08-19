package com.windown.worker.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record AttendanceRequest(
        @NotNull(message = "workerId không được để trống")
        Long workerId,

        @NotNull(message = "Trạng thái chấm công không được để trống")
        Boolean isPresent,

        String note
) {}
