package com.windown.worker.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record BulkAttendanceRequest(
        @NotNull(message = "Ngày chấm công không được để trống")
        LocalDate workDate,

        @NotEmpty(message = "Danh sách chấm công không được rỗng")
        @Valid
        List<AttendanceRequest> checkIns
) {}
