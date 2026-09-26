package com.windown.project.dto;

import java.time.LocalDateTime;

public record ProjectDrawingResponse(
        Long id,
        Long projectId,
        String fileName,
        String fileType,
        LocalDateTime uploadedAt
) {}
