package com.windown.project.controller;

import com.windown.project.dto.ProjectDrawingResponse;
import com.windown.project.service.ProjectDrawingService;
import com.windown.project.service.ProjectDrawingService.DrawingFileWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProjectDrawingController {

    private final ProjectDrawingService drawingService;

    @PostMapping("/api/projects/{projectId}/drawings")
    public ResponseEntity<ProjectDrawingResponse> uploadDrawing(
            @PathVariable Long projectId,
            @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(drawingService.saveDrawing(projectId, file));
    }

    @GetMapping("/api/projects/{projectId}/drawings")
    public ResponseEntity<List<ProjectDrawingResponse>> getDrawings(@PathVariable Long projectId) {
        return ResponseEntity.ok(drawingService.getDrawingsByProjectId(projectId));
    }

    @DeleteMapping("/api/projects/drawings/{id}")
    public ResponseEntity<Void> deleteDrawing(@PathVariable Long id) {
        drawingService.deleteDrawing(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/projects/drawings/{id}/file")
    public ResponseEntity<Resource> getDrawingFile(@PathVariable Long id) {
        DrawingFileWrapper wrapper = drawingService.getDrawingFileWrapper(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, wrapper.fileType())
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + wrapper.fileName() + "\"")
                .body(wrapper.resource());
    }
}
