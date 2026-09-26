package com.windown.backup.controller;

import com.windown.backup.dto.BackupData;
import com.windown.backup.service.BackupRestoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/backup-restore")
@RequiredArgsConstructor
public class BackupRestoreController {

    private final BackupRestoreService backupRestoreService;

    @GetMapping("/export")
    public ResponseEntity<BackupData> exportBackup() {
        return ResponseEntity.ok(backupRestoreService.exportBackup());
    }

    @PostMapping("/import")
    public ResponseEntity<Void> importRestore(@RequestBody BackupData data) {
        backupRestoreService.importRestore(data);
        return ResponseEntity.ok().build();
    }
}
