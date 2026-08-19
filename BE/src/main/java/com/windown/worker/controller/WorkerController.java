package com.windown.worker.controller;

import com.windown.worker.dto.WorkerRequest;
import com.windown.worker.dto.WorkerResponse;
import com.windown.worker.service.WorkerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workers")
@RequiredArgsConstructor
public class WorkerController {

    private final WorkerService workerService;

    @GetMapping
    public ResponseEntity<Page<WorkerResponse>> getWorkers(
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(workerService.getWorkers(isActive, keyword, PageRequest.of(page, size)));
    }

    @GetMapping("/active")
    public ResponseEntity<List<WorkerResponse>> getActiveWorkers() {
        return ResponseEntity.ok(workerService.getActiveWorkers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkerResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(workerService.getById(id));
    }

    @PostMapping
    public ResponseEntity<WorkerResponse> create(@Valid @RequestBody WorkerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(workerService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkerResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody WorkerRequest request
    ) {
        return ResponseEntity.ok(workerService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        workerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
