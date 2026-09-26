package com.windown.project.controller;

import com.windown.project.dto.*;
import com.windown.project.entity.Project.ProjectStatus;
import com.windown.project.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    /** GET /api/projects?status=IN_PROGRESS&keyword=Nguyễn&page=0&size=20 */
    @GetMapping
    public ResponseEntity<Page<ProjectResponse>> getAll(
            @RequestParam(required = false) ProjectStatus status,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(projectService.getProjects(status, keyword, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> create(@Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ProjectRequest request
    ) {
        return ResponseEntity.ok(projectService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /** POST /api/projects/{id}/payments — Ghi nhận thanh toán */
    @PostMapping("/{id}/payments")
    public ResponseEntity<ProjectResponse> addPayment(
            @PathVariable Long id,
            @Valid @RequestBody PaymentRequest request
    ) {
        return ResponseEntity.ok(projectService.addPayment(id, request));
    }

    /** GET /api/projects/dashboard — KPI tổng quan */
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> dashboard() {
        return ResponseEntity.ok(projectService.getDashboardStats());
    }
}
