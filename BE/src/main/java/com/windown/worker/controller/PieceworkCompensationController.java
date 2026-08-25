package com.windown.worker.controller;

import com.windown.worker.dto.PieceworkRequest;
import com.windown.worker.dto.PieceworkResponse;
import com.windown.worker.service.PieceworkCompensationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PieceworkCompensationController {

    private final PieceworkCompensationService pieceworkService;

    @GetMapping("/api/workers/{workerId}/piecework")
    public ResponseEntity<List<PieceworkResponse>> getPieceworks(@PathVariable Long workerId) {
        return ResponseEntity.ok(pieceworkService.getPieceworksByWorkerId(workerId));
    }

    @PostMapping("/api/workers/{workerId}/piecework")
    public ResponseEntity<PieceworkResponse> createPiecework(
            @PathVariable Long workerId,
            @Valid @RequestBody PieceworkRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(pieceworkService.createPiecework(workerId, request));
    }

    @DeleteMapping("/api/piecework-compensations/{id}")
    public ResponseEntity<Void> deletePiecework(@PathVariable Long id) {
        pieceworkService.deletePiecework(id);
        return ResponseEntity.noContent().build();
    }
}
