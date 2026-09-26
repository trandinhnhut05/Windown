package com.windown.project.service;

import com.windown.common.exception.AppException;
import com.windown.project.dto.ProjectDrawingResponse;
import com.windown.project.entity.Project;
import com.windown.project.entity.ProjectDrawing;
import com.windown.project.repository.ProjectDrawingRepository;
import com.windown.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectDrawingService {

    private final ProjectDrawingRepository drawingRepository;
    private final ProjectRepository projectRepository;
    private final Path fileStorageLocation = Paths.get("uploads/drawings").toAbsolutePath().normalize();

    @Transactional
    public ProjectDrawingResponse saveDrawing(Long projectId, MultipartFile file) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy công trình #" + projectId));

        try {
            // Create directories if they do not exist
            Files.createDirectories(this.fileStorageLocation);

            // Clean file name and prevent collisions
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path targetLocation = this.fileStorageLocation.resolve(fileName);

            // Copy file to target location
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            ProjectDrawing drawing = ProjectDrawing.builder()
                    .project(project)
                    .fileName(file.getOriginalFilename())
                    .filePath(fileName)
                    .fileType(file.getContentType() != null ? file.getContentType() : "application/octet-stream")
                    .build();

            return toResponse(drawingRepository.save(drawing));
        } catch (IOException ex) {
            throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "FILE_SAVE_ERROR", "Không thể lưu trữ tệp tin bản vẽ: " + ex.getMessage());
        }
    }

    public List<ProjectDrawingResponse> getDrawingsByProjectId(Long projectId) {
        return drawingRepository.findByProjectIdOrderByUploadedAtDesc(projectId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void deleteDrawing(Long id) {
        ProjectDrawing drawing = drawingRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy bản vẽ #" + id));

        try {
            Path filePath = this.fileStorageLocation.resolve(drawing.getFilePath()).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            System.err.println("Cảnh báo: Không thể xóa tệp trên đĩa: " + ex.getMessage());
        }

        drawingRepository.delete(drawing);
    }

    public record DrawingFileWrapper(Resource resource, String fileType, String fileName) {}

    public DrawingFileWrapper getDrawingFileWrapper(Long id) {
        ProjectDrawing drawing = drawingRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy bản vẽ #" + id));

        try {
            Path filePath = this.fileStorageLocation.resolve(drawing.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return new DrawingFileWrapper(resource, drawing.getFileType(), drawing.getFileName());
            } else {
                throw AppException.notFound("Không tìm thấy tệp tin bản vẽ trên máy chủ");
            }
        } catch (MalformedURLException ex) {
            throw AppException.notFound("Không tìm thấy tệp tin bản vẽ: " + ex.getMessage());
        }
    }

    private ProjectDrawingResponse toResponse(ProjectDrawing p) {
        return new ProjectDrawingResponse(
                p.getId(),
                p.getProject().getId(),
                p.getFileName(),
                p.getFileType(),
                p.getUploadedAt()
        );
    }
}
