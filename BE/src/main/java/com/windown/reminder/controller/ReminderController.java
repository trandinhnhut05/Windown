package com.windown.reminder.controller;

import com.windown.reminder.dto.ReminderRequest;
import com.windown.reminder.dto.ReminderResponse;
import com.windown.reminder.service.ReminderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderService reminderService;

    @GetMapping
    public ResponseEntity<List<ReminderResponse>> getAll() {
        return ResponseEntity.ok(reminderService.getAllReminders());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<ReminderResponse>> getPending() {
        return ResponseEntity.ok(reminderService.getPendingReminders());
    }

    @PostMapping
    public ResponseEntity<ReminderResponse> create(@Valid @RequestBody ReminderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reminderService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReminderResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ReminderRequest request
    ) {
        return ResponseEntity.ok(reminderService.update(id, request));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ReminderResponse> toggleDone(@PathVariable Long id) {
        return ResponseEntity.ok(reminderService.toggleDone(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reminderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
