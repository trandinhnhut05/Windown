package com.windown.warranty.controller;

import com.windown.warranty.dto.WarrantyRequest;
import com.windown.warranty.dto.WarrantyResponse;
import com.windown.warranty.service.WarrantyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class WarrantyController {

    private final WarrantyService warrantyService;

    @GetMapping("/warranties")
    public ResponseEntity<List<WarrantyResponse>> getAll() {
        return ResponseEntity.ok(warrantyService.getAll());
    }

    @GetMapping("/projects/{projectId}/warranties")
    public ResponseEntity<List<WarrantyResponse>> getWarranties(@PathVariable Long projectId) {
        return ResponseEntity.ok(warrantyService.getWarrantiesByProject(projectId));
    }

    @PostMapping("/projects/{projectId}/warranties")
    public ResponseEntity<WarrantyResponse> create(
            @PathVariable Long projectId,
            @Valid @RequestBody WarrantyRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(warrantyService.create(projectId, request));
    }

    @PutMapping("/warranties/{id}")
    public ResponseEntity<WarrantyResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody WarrantyRequest request
    ) {
        return ResponseEntity.ok(warrantyService.update(id, request));
    }

    @DeleteMapping("/warranties/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        warrantyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
