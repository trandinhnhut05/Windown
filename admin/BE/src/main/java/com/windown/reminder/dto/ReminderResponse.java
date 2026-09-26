package com.windown.reminder.dto;

import com.windown.reminder.entity.ReminderType;
import java.time.LocalDateTime;

public record ReminderResponse(
    Long id,
    String title,
    LocalDateTime remindAt,
    ReminderType type,
    boolean isDone,
    Long projectId,
    String projectName,
    String note,
    LocalDateTime createdAt
) {}
