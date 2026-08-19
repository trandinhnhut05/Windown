package com.windown.backup.dto;

import com.windown.reminder.entity.ReminderType;
import com.windown.project.entity.Project.ProjectStatus;
import com.windown.project.entity.Payment.PaymentType;
import com.windown.auth.entity.User.Role;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record BackupData(
    List<BackupUser> users,
    List<BackupProject> projects,
    List<BackupPayment> payments,
    List<BackupMaterial> materials,
    List<BackupMaterialTemplate> materialTemplates,
    List<BackupWorker> workers,
    List<BackupAttendance> attendances,
    List<BackupSalaryAdvance> salaryAdvances,
    List<BackupWarranty> warranties,
    List<BackupReminder> reminders
) {
    public record BackupUser(String username, String password, String fullName, Role role, boolean isActive) {}
    
    public record BackupProject(
        Long id, String projectCode, String name, String customerName, String customerPhone, String address,
        BigDecimal lengthM, BigDecimal widthM, BigDecimal areaM2, BigDecimal unitPrice, BigDecimal totalAmount, BigDecimal deposit,
        BigDecimal extraPaid, LocalDate startDate, LocalDate deliveryDate, ProjectStatus status, String note, String createdBy
    ) {}

    public record BackupPayment(Long id, Long projectId, BigDecimal amount, PaymentType type, LocalDateTime paidAt, String note) {}

    public record BackupMaterial(Long id, Long projectId, String name, String unit, BigDecimal quantity, BigDecimal unitPrice, String note) {}

    public record BackupMaterialTemplate(Long id, String name, String unit, BigDecimal defaultPrice) {}

    public record BackupWorker(Long id, String name, String phone, BigDecimal dailyWage, boolean isActive, String note) {}

    public record BackupAttendance(Long id, Long workerId, LocalDate workDate, boolean isPresent, String note) {}

    public record BackupSalaryAdvance(Long id, Long workerId, BigDecimal amount, LocalDate advanceDate, String note) {}

    public record BackupWarranty(Long id, Long projectId, LocalDate warrantyDate, String issue, boolean isResolved, LocalDate resolvedAt, String note) {}

    public record BackupReminder(Long id, String title, LocalDateTime remindAt, ReminderType type, boolean isDone, Long projectId, String note) {}
}
