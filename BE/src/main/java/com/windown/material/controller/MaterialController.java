package com.windown.material.controller;

import com.windown.material.dto.FinancialChartResponse;
import com.windown.material.dto.MaterialRequest;
import com.windown.material.dto.MaterialResponse;
import com.windown.material.dto.MaterialTemplateResponse;
import com.windown.material.service.MaterialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MaterialController {

    private final MaterialService materialService;

    @GetMapping("/projects/{projectId}/materials")
    public ResponseEntity<List<MaterialResponse>> getMaterialsByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(materialService.getMaterialsByProjectId(projectId));
    }

    @PostMapping("/projects/{projectId}/materials")
    public ResponseEntity<MaterialResponse> addMaterial(
            @PathVariable Long projectId,
            @Valid @RequestBody MaterialRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(materialService.addMaterial(projectId, request));
    }

    @PutMapping("/materials/{id}")
    public ResponseEntity<MaterialResponse> updateMaterial(
            @PathVariable Long id,
            @Valid @RequestBody MaterialRequest request
    ) {
        return ResponseEntity.ok(materialService.updateMaterial(id, request));
    }

    @DeleteMapping("/materials/{id}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Long id) {
        materialService.deleteMaterial(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/materials/templates")
    public ResponseEntity<List<MaterialTemplateResponse>> getTemplates(
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(materialService.getTemplates(keyword));
    }

    @GetMapping("/projects/reports/financial-chart")
    public ResponseEntity<List<FinancialChartResponse>> getFinancialChart(
            @RequestParam(required = false) Integer year
    ) {
        return ResponseEntity.ok(materialService.getFinancialChart(year));
    }
}
