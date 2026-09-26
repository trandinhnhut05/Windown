package com.windown.warranty.service;

import com.windown.common.exception.AppException;
import com.windown.project.entity.Project;
import com.windown.project.repository.ProjectRepository;
import com.windown.warranty.dto.WarrantyRequest;
import com.windown.warranty.dto.WarrantyResponse;
import com.windown.warranty.entity.Warranty;
import com.windown.warranty.repository.WarrantyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WarrantyService {

    private final WarrantyRepository warrantyRepository;
    private final ProjectRepository projectRepository;

    public List<WarrantyResponse> getWarrantiesByProject(Long projectId) {
        return warrantyRepository.findByProjectIdOrderByWarrantyDateDesc(projectId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public WarrantyResponse getById(Long id) {
        return warrantyRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy nhật ký bảo hành #" + id));
    }

    @Transactional
    public WarrantyResponse create(Long projectId, WarrantyRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy công trình #" + projectId));

        Warranty warranty = Warranty.builder()
                .project(project)
                .warrantyDate(request.warrantyDate())
                .issue(request.issue())
                .isResolved(request.isResolved() != null && request.isResolved())
                .resolvedAt(request.resolvedAt())
                .note(request.note())
                .build();

        return toResponse(warrantyRepository.save(warranty));
    }

    @Transactional
    public WarrantyResponse update(Long id, WarrantyRequest request) {
        Warranty warranty = warrantyRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy nhật ký bảo hành #" + id));

        warranty.setWarrantyDate(request.warrantyDate());
        warranty.setIssue(request.issue());
        if (request.isResolved() != null) {
            warranty.setResolved(request.isResolved());
            if (request.isResolved()) {
                warranty.setResolvedAt(request.resolvedAt() != null ? request.resolvedAt() : java.time.LocalDate.now());
            } else {
                warranty.setResolvedAt(null);
            }
        }
        warranty.setNote(request.note());

        return toResponse(warrantyRepository.save(warranty));
    }

    @Transactional
    public void delete(Long id) {
        if (!warrantyRepository.existsById(id)) {
            throw AppException.notFound("Không tìm thấy nhật ký bảo hành #" + id);
        }
        warrantyRepository.deleteById(id);
    }

    public List<WarrantyResponse> getAll() {
        return warrantyRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private WarrantyResponse toResponse(Warranty w) {
        return new WarrantyResponse(
                w.getId(),
                w.getProject().getId(),
                w.getProject().getName(),
                w.getWarrantyDate(),
                w.getIssue(),
                w.isResolved(),
                w.getResolvedAt(),
                w.getNote(),
                w.getCreatedAt()
        );
    }
}
