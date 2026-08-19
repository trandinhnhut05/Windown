package com.windown.project.service;

import com.windown.auth.entity.User;
import com.windown.auth.repository.UserRepository;
import com.windown.common.exception.AppException;
import com.windown.material.repository.MaterialRepository;
import com.windown.project.dto.*;
import com.windown.project.entity.Payment;
import com.windown.project.entity.Project;
import com.windown.project.entity.Project.ProjectStatus;
import com.windown.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final MaterialRepository materialRepository;

    private static final AtomicInteger codeCounter = new AtomicInteger(0);

    // ========== CRUD ==========

    public Page<ProjectResponse> getProjects(ProjectStatus status, String keyword, Pageable pageable) {
        return projectRepository.searchProjects(status, keyword, pageable)
                .map(this::toResponse);
    }

    public ProjectResponse getById(Long id) {
        return toResponse(findProjectOrThrow(id));
    }

    @Transactional
    public ProjectResponse create(ProjectRequest request) {
        String code = generateProjectCode();
        User currentUser = getCurrentUser();

        Project project = Project.builder()
                .projectCode(code)
                .name(request.name())
                .customerName(request.customerName())
                .customerPhone(request.customerPhone())
                .address(request.address())
                .lengthM(request.lengthM())
                .widthM(request.widthM())
                .unitPrice(request.unitPrice())
                .deposit(request.deposit() != null ? request.deposit() : BigDecimal.ZERO)
                .extraPaid(BigDecimal.ZERO)
                .status(request.status() != null ? request.status() : ProjectStatus.PENDING)
                .startDate(request.startDate())
                .deliveryDate(request.deliveryDate())
                .note(request.note())
                .createdBy(currentUser)
                .build();

        return toResponse(projectRepository.save(project));
    }

    @Transactional
    public ProjectResponse update(Long id, ProjectRequest request) {
        Project project = findProjectOrThrow(id);

        project.setName(request.name());
        project.setCustomerName(request.customerName());
        project.setCustomerPhone(request.customerPhone());
        project.setAddress(request.address());
        project.setLengthM(request.lengthM());
        project.setWidthM(request.widthM());
        project.setUnitPrice(request.unitPrice());
        if (request.deposit() != null) project.setDeposit(request.deposit());
        if (request.status() != null) project.setStatus(request.status());
        project.setStartDate(request.startDate());
        project.setDeliveryDate(request.deliveryDate());
        project.setNote(request.note());

        return toResponse(projectRepository.save(project));
    }

    @Transactional
    public void delete(Long id) {
        Project project = findProjectOrThrow(id);
        projectRepository.delete(project);
    }

    // ========== Payments ==========

    @Transactional
    public ProjectResponse addPayment(Long projectId, PaymentRequest request) {
        Project project = findProjectOrThrow(projectId);

        Payment payment = Payment.builder()
                .project(project)
                .amount(request.amount())
                .type(request.type())
                .note(request.note())
                .paidAt(request.paidAt() != null ? request.paidAt() : LocalDateTime.now())
                .build();

        project.getPayments().add(payment);

        // Update extra_paid accumulation
        if (request.type() == Payment.PaymentType.EXTRA || request.type() == Payment.PaymentType.FINAL) {
            project.setExtraPaid(project.getExtraPaid().add(request.amount()));
        }

        // Auto-mark as completed if debt is cleared
        if (project.getRemainingDebt().compareTo(BigDecimal.ZERO) <= 0) {
            project.setStatus(ProjectStatus.COMPLETED);
        }

        return toResponse(projectRepository.save(project));
    }

    // ========== Dashboard ==========

    public DashboardStats getDashboardStats() {
        long total = projectRepository.count();
        long inProgress = projectRepository.countByStatus(ProjectStatus.IN_PROGRESS);
        long completed = projectRepository.countByStatus(ProjectStatus.COMPLETED);
        long waiting = projectRepository.countByStatus(ProjectStatus.WAITING_PAYMENT);
        BigDecimal totalRevenue = projectRepository.sumTotalRevenue();
        BigDecimal totalDebt = projectRepository.sumTotalDebt();
        BigDecimal totalPaid = totalRevenue.subtract(totalDebt);

        return new DashboardStats(total, inProgress, completed, waiting, totalRevenue, totalDebt, totalPaid);
    }

    // ========== Helpers ==========

    private Project findProjectOrThrow(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy công trình #" + id));
    }

    private String generateProjectCode() {
        String month = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMM"));
        int seq = (int)(projectRepository.count() + 1);
        return String.format("CT-%s-%03d", month, seq);
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username).orElse(null);
    }

    private ProjectResponse toResponse(Project p) {
        BigDecimal materialCost = materialRepository.sumTotalByProjectId(p.getId());
        BigDecimal estimatedProfit = p.getTotalAmount().subtract(materialCost);

        return new ProjectResponse(
                p.getId(),
                p.getProjectCode(),
                p.getName(),
                p.getCustomerName(),
                p.getCustomerPhone(),
                p.getAddress(),
                p.getLengthM(),
                p.getWidthM(),
                p.getAreaM2(),
                p.getUnitPrice(),
                p.getTotalAmount(),
                p.getDeposit(),
                p.getExtraPaid(),
                p.getRemainingDebt(),
                materialCost,
                estimatedProfit,
                p.getStatus(),
                p.getStartDate(),
                p.getDeliveryDate(),
                p.getNote(),
                p.getPayments().stream().map(ProjectResponse.PaymentInfo::from).toList(),
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }
}
