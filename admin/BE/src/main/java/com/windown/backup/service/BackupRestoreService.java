package com.windown.backup.service;

import com.windown.backup.dto.BackupData;
import com.windown.material.entity.Material;
import com.windown.material.entity.MaterialTemplate;
import com.windown.material.repository.MaterialRepository;
import com.windown.material.repository.MaterialTemplateRepository;
import com.windown.project.entity.Payment;
import com.windown.project.entity.Project;
import com.windown.project.repository.PaymentRepository;
import com.windown.project.repository.ProjectRepository;
import com.windown.reminder.entity.Reminder;
import com.windown.reminder.repository.ReminderRepository;
import com.windown.auth.entity.User;
import com.windown.auth.repository.UserRepository;
import com.windown.warranty.entity.Warranty;
import com.windown.warranty.repository.WarrantyRepository;
import com.windown.worker.entity.Attendance;
import com.windown.worker.entity.SalaryAdvance;
import com.windown.worker.entity.Worker;
import com.windown.worker.repository.AttendanceRepository;
import com.windown.worker.repository.SalaryAdvanceRepository;
import com.windown.worker.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BackupRestoreService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final PaymentRepository paymentRepository;
    private final MaterialRepository materialRepository;
    private final MaterialTemplateRepository materialTemplateRepository;
    private final WorkerRepository workerRepository;
    private final AttendanceRepository attendanceRepository;
    private final SalaryAdvanceRepository salaryAdvanceRepository;
    private final WarrantyRepository warrantyRepository;
    private final ReminderRepository reminderRepository;

    public BackupData exportBackup() {
        // 1. Users
        List<BackupData.BackupUser> users = userRepository.findAll().stream()
                .map(u -> new BackupData.BackupUser(u.getUsername(), u.getPassword(), u.getFullName(), u.getRole(), u.isActive()))
                .toList();

        // 2. Projects
        List<BackupData.BackupProject> projects = projectRepository.findAll().stream()
                .map(p -> new BackupData.BackupProject(
                        p.getId(), p.getProjectCode(), p.getName(), p.getCustomerName(), p.getCustomerPhone(), p.getAddress(),
                        p.getLengthM(), p.getWidthM(), p.getAreaM2(), p.getUnitPrice(), p.getTotalAmount(), p.getDeposit(),
                        p.getExtraPaid(), p.getStartDate(), p.getDeliveryDate(), p.getStatus(), p.getNote(),
                        p.getCreatedBy() != null ? p.getCreatedBy().getUsername() : null
                )).toList();

        // 3. Payments
        List<BackupData.BackupPayment> payments = paymentRepository.findAll().stream()
                .map(pay -> new BackupData.BackupPayment(
                        pay.getId(), pay.getProject().getId(), pay.getAmount(), pay.getType(), pay.getPaidAt(), pay.getNote()
                )).toList();

        // 4. Materials
        List<BackupData.BackupMaterial> materials = materialRepository.findAll().stream()
                .map(m -> new BackupData.BackupMaterial(
                        m.getId(), m.getProject().getId(), m.getName(), m.getUnit(), m.getQuantity(), m.getUnitPrice(), m.getNote()
                )).toList();

        // 5. Material Templates
        List<BackupData.BackupMaterialTemplate> templates = materialTemplateRepository.findAll().stream()
                .map(t -> new BackupData.BackupMaterialTemplate(
                        t.getId(), t.getName(), t.getUnit(), t.getDefaultPrice()
                )).toList();

        // 6. Workers
        List<BackupData.BackupWorker> workers = workerRepository.findAll().stream()
                .map(w -> new BackupData.BackupWorker(
                        w.getId(), w.getName(), w.getPhone(), w.getDailyWage(), w.isActive(), w.getNote()
                )).toList();

        // 7. Attendance
        List<BackupData.BackupAttendance> attendances = attendanceRepository.findAll().stream()
                .map(att -> new BackupData.BackupAttendance(
                        att.getId(), att.getWorker().getId(), att.getWorkDate(), att.isPresent(), att.getNote()
                )).toList();

        // 8. Salary Advances
        List<BackupData.BackupSalaryAdvance> advances = salaryAdvanceRepository.findAll().stream()
                .map(sa -> new BackupData.BackupSalaryAdvance(
                        sa.getId(), sa.getWorker().getId(), sa.getAmount(), sa.getAdvanceDate(), sa.getNote()
                )).toList();

        // 9. Warranties
        List<BackupData.BackupWarranty> warranties = warrantyRepository.findAll().stream()
                .map(war -> new BackupData.BackupWarranty(
                        war.getId(), war.getProject().getId(), war.getWarrantyDate(), war.getIssue(), war.isResolved(), war.getResolvedAt(), war.getNote()
                )).toList();

        // 10. Reminders
        List<BackupData.BackupReminder> reminders = reminderRepository.findAll().stream()
                .map(r -> new BackupData.BackupReminder(
                        r.getId(), r.getTitle(), r.getRemindAt(), r.getType(), r.isDone(), r.getProject() != null ? r.getProject().getId() : null, r.getNote()
                )).toList();

        return new BackupData(users, projects, payments, materials, templates, workers, attendances, advances, warranties, reminders);
    }

    @Transactional
    public void importRestore(BackupData data) {
        // 1. Wipe database in correct constraint order
        reminderRepository.deleteAllInBatch();
        warrantyRepository.deleteAllInBatch();
        salaryAdvanceRepository.deleteAllInBatch();
        attendanceRepository.deleteAllInBatch();
        workerRepository.deleteAllInBatch();
        materialRepository.deleteAllInBatch();
        paymentRepository.deleteAllInBatch();
        projectRepository.deleteAllInBatch();
        userRepository.deleteAllInBatch();
        materialTemplateRepository.deleteAllInBatch();

        // 2. Restore User Accounts
        Map<String, User> userMap = new HashMap<>();
        for (BackupData.BackupUser bu : data.users()) {
            User u = User.builder()
                    .username(bu.username())
                    .password(bu.password())
                    .fullName(bu.fullName())
                    .role(bu.role())
                    .isActive(bu.isActive())
                    .build();
            User saved = userRepository.save(u);
            userMap.put(saved.getUsername(), saved);
        }

        // 3. Restore Material Templates
        for (BackupData.BackupMaterialTemplate bt : data.materialTemplates()) {
            MaterialTemplate t = MaterialTemplate.builder()
                    .id(bt.id())
                    .name(bt.name())
                    .unit(bt.unit())
                    .defaultPrice(bt.defaultPrice())
                    .build();
            materialTemplateRepository.save(t);
        }

        // 4. Restore Projects
        Map<Long, Project> projectMap = new HashMap<>();
        for (BackupData.BackupProject bp : data.projects()) {
            Project p = Project.builder()
                    .id(bp.id())
                    .projectCode(bp.projectCode())
                    .name(bp.name())
                    .customerName(bp.customerName())
                    .customerPhone(bp.customerPhone())
                    .address(bp.address())
                    .lengthM(bp.lengthM())
                    .widthM(bp.widthM())
                    .areaM2(bp.areaM2())
                    .unitPrice(bp.unitPrice())
                    .totalAmount(bp.totalAmount())
                    .deposit(bp.deposit())
                    .extraPaid(bp.extraPaid())
                    .startDate(bp.startDate())
                    .deliveryDate(bp.deliveryDate())
                    .status(bp.status())
                    .note(bp.note())
                    .createdBy(bp.createdBy() != null ? userMap.get(bp.createdBy()) : null)
                    .build();
            Project saved = projectRepository.save(p);
            projectMap.put(saved.getId(), saved);
        }

        // 5. Restore Payments
        for (BackupData.BackupPayment bpay : data.payments()) {
            Project project = projectMap.get(bpay.projectId());
            if (project != null) {
                Payment pay = Payment.builder()
                        .id(bpay.id())
                        .project(project)
                        .amount(bpay.amount())
                        .type(bpay.type())
                        .paidAt(bpay.paidAt())
                        .note(bpay.note())
                        .build();
                paymentRepository.save(pay);
            }
        }

        // 6. Restore Materials
        for (BackupData.BackupMaterial bm : data.materials()) {
            Project project = projectMap.get(bm.projectId());
            if (project != null) {
                Material m = Material.builder()
                        .id(bm.id())
                        .project(project)
                        .name(bm.name())
                        .unit(bm.unit())
                        .quantity(bm.quantity())
                        .unitPrice(bm.unitPrice())
                        .note(bm.note())
                        .build();
                materialRepository.save(m);
            }
        }

        // 7. Restore Workers
        Map<Long, Worker> workerMap = new HashMap<>();
        for (BackupData.BackupWorker bw : data.workers()) {
            Worker w = Worker.builder()
                    .id(bw.id())
                    .name(bw.name())
                    .phone(bw.phone())
                    .dailyWage(bw.dailyWage())
                    .isActive(bw.isActive())
                    .note(bw.note())
                    .build();
            Worker saved = workerRepository.save(w);
            workerMap.put(saved.getId(), saved);
        }

        // 8. Restore Attendance
        for (BackupData.BackupAttendance ba : data.attendances()) {
            Worker worker = workerMap.get(ba.workerId());
            if (worker != null) {
                Attendance att = Attendance.builder()
                        .id(ba.id())
                        .worker(worker)
                        .workDate(ba.workDate())
                        .isPresent(ba.isPresent())
                        .note(ba.note())
                        .build();
                attendanceRepository.save(att);
            }
        }

        // 9. Restore Salary Advances
        for (BackupData.BackupSalaryAdvance bsa : data.salaryAdvances()) {
            Worker worker = workerMap.get(bsa.workerId());
            if (worker != null) {
                SalaryAdvance sa = SalaryAdvance.builder()
                        .id(bsa.id())
                        .worker(worker)
                        .amount(bsa.amount())
                        .advanceDate(bsa.advanceDate())
                        .note(bsa.note())
                        .build();
                salaryAdvanceRepository.save(sa);
            }
        }

        // 10. Restore Warranties
        for (BackupData.BackupWarranty bwar : data.warranties()) {
            Project project = projectMap.get(bwar.projectId());
            if (project != null) {
                Warranty war = Warranty.builder()
                        .id(bwar.id())
                        .project(project)
                        .warrantyDate(bwar.warrantyDate())
                        .issue(bwar.issue())
                        .isResolved(bwar.isResolved())
                        .resolvedAt(bwar.resolvedAt())
                        .note(bwar.note())
                        .build();
                warrantyRepository.save(war);
            }
        }

        // 11. Restore Reminders
        for (BackupData.BackupReminder br : data.reminders()) {
            Project project = br.projectId() != null ? projectMap.get(br.projectId()) : null;
            Reminder r = Reminder.builder()
                    .id(br.id())
                    .title(br.title())
                    .remindAt(br.remindAt())
                    .type(br.type())
                    .isDone(br.isDone())
                    .project(project)
                    .note(br.note())
                    .build();
            reminderRepository.save(r);
        }
    }
}
