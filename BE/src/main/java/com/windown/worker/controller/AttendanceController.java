package com.windown.worker.controller;

import com.windown.worker.dto.AttendanceResponse;
import com.windown.worker.dto.BulkAttendanceRequest;
import com.windown.worker.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    public ResponseEntity<List<AttendanceResponse>> getAttendance(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        return ResponseEntity.ok(attendanceService.getAttendanceBetween(start, end));
    }

    @GetMapping("/day")
    public ResponseEntity<List<AttendanceResponse>> getAttendanceByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(attendanceService.getAttendanceByDate(date));
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<AttendanceResponse>> saveBulk(
            @Valid @RequestBody BulkAttendanceRequest request
    ) {
        return ResponseEntity.ok(attendanceService.saveBulkAttendance(request));
    }
}
