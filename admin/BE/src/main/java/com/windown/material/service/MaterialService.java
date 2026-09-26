package com.windown.material.service;

import com.windown.common.exception.AppException;
import com.windown.material.dto.*;
import com.windown.material.entity.Material;
import com.windown.material.entity.MaterialTemplate;
import com.windown.material.repository.MaterialRepository;
import com.windown.material.repository.MaterialTemplateRepository;
import com.windown.project.entity.Project;
import com.windown.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final MaterialTemplateRepository materialTemplateRepository;
    private final ProjectRepository projectRepository;

    public List<MaterialResponse> getMaterialsByProjectId(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw AppException.notFound("Không tìm thấy công trình #" + projectId);
        }
        return materialRepository.findByProjectId(projectId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public MaterialResponse addMaterial(Long projectId, MaterialRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy công trình #" + projectId));

        Material material = Material.builder()
                .project(project)
                .name(request.name())
                .unit(request.unit())
                .quantity(request.quantity())
                .unitPrice(request.unitPrice())
                .note(request.note())
                .build();

        return toResponse(materialRepository.save(material));
    }

    @Transactional
    public MaterialResponse updateMaterial(Long id, MaterialRequest request) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy vật tư #" + id));

        material.setName(request.name());
        material.setUnit(request.unit());
        material.setQuantity(request.quantity());
        material.setUnitPrice(request.unitPrice());
        material.setNote(request.note());

        return toResponse(materialRepository.save(material));
    }

    @Transactional
    public void deleteMaterial(Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy vật tư #" + id));
        materialRepository.delete(material);
    }

    public List<MaterialTemplateResponse> getTemplates(String keyword) {
        List<MaterialTemplate> templates = (keyword == null || keyword.isBlank())
                ? materialTemplateRepository.findByIsActiveTrue()
                : materialTemplateRepository.searchTemplates(keyword);

        return templates.stream()
                .map(t -> new MaterialTemplateResponse(t.getId(), t.getName(), t.getUnit(), t.getDefaultPrice()))
                .toList();
    }

    public List<FinancialChartResponse> getFinancialChart(Integer year) {
        int targetYear = (year == null) ? LocalDate.now().getYear() : year;
        List<FinancialChartResponse> reports = new ArrayList<>();

        for (int m = 1; m <= 12; m++) {
            BigDecimal revenue = projectRepository.sumTotalRevenueByMonth(targetYear, m);
            BigDecimal cost = materialRepository.sumTotalCostByMonth(targetYear, m);
            BigDecimal profit = revenue.subtract(cost);

            reports.add(new FinancialChartResponse(
                    "Tháng " + m,
                    revenue,
                    cost,
                    profit
            ));
        }

        return reports;
    }

    private MaterialResponse toResponse(Material m) {
        // total is a generated column, but if fetched right after insert it might be null before commit.
        // We compute it dynamically if null to avoid any transient state issue in Spring JPA.
        BigDecimal total = (m.getTotal() != null)
                ? m.getTotal()
                : m.getQuantity().multiply(m.getUnitPrice());

        return new MaterialResponse(
                m.getId(),
                m.getProject().getId(),
                m.getName(),
                m.getUnit(),
                m.getQuantity(),
                m.getUnitPrice(),
                total,
                m.getNote(),
                m.getCreatedAt()
        );
    }
}
