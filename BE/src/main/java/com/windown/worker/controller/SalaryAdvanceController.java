package com.windown.worker.controller;

import com.windown.worker.dto.SalaryAdvanceRequest;
import com.windown.worker.dto.SalaryAdvanceResponse;
import com.windown.worker.service.SalaryAdvanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SalaryAdvanceController {

    private final SalaryAdvanceService salaryAdvanceService;

    @GetMapping("/workers/{workerId}/advances")
    public ResponseEntity<List<SalaryAdvanceResponse>> getAdvancesByWorker(@PathVariable Long workerId) {
        return ResponseEntity.ok(salaryAdvanceService.getAdvancesByWorkerId(workerId));
    }

    @PostMapping("/workers/{workerId}/advances")
    public ResponseEntity<SalaryAdvanceResponse> addAdvance(
            @PathVariable Long workerId,
            @Valid @RequestBody SalaryAdvanceRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(salaryAdvanceService.addAdvance(workerId, request));
    }

    @DeleteMapping("/salary-advances/{id}")
    public ResponseEntity<Void> deleteAdvance(@PathVariable Long id) {
        salaryAdvanceService.deleteAdvance(id);
        return ResponseEntity.noContent().build();
    }
}
