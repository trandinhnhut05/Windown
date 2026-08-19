package com.windown.reminder.dto;

import com.windown.reminder.entity.ReminderType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record ReminderRequest(
    @NotBlank(message = "Tiêu đề nhắc nhở không được để trống")
    String title,

    @NotNull(message = "Thời gian nhắc nhở không được để trống")
    LocalDateTime remindAt,

    ReminderType type,
    Boolean isDone,
    Long projectId,
    String note
) {}
