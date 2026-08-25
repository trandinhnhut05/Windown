package com.windown.common;

import com.windown.auth.entity.User;
import com.windown.auth.entity.User.Role;
import com.windown.auth.repository.UserRepository;
import com.windown.material.entity.Material;
import com.windown.material.entity.MaterialTemplate;
import com.windown.material.repository.MaterialRepository;
import com.windown.material.repository.MaterialTemplateRepository;
import com.windown.project.entity.Payment;
import com.windown.project.entity.Payment.PaymentType;
import com.windown.project.entity.Project;
import com.windown.project.entity.Project.ProjectStatus;
import com.windown.project.repository.PaymentRepository;
import com.windown.project.repository.ProjectRepository;
import com.windown.reminder.entity.Reminder;
import com.windown.reminder.entity.ReminderType;
import com.windown.reminder.repository.ReminderRepository;
import com.windown.warranty.entity.Warranty;
import com.windown.warranty.repository.WarrantyRepository;
import com.windown.worker.entity.Attendance;
import com.windown.worker.entity.SalaryAdvance;
import com.windown.worker.entity.Worker;
import com.windown.worker.repository.AttendanceRepository;
import com.windown.worker.repository.SalaryAdvanceRepository;
import com.windown.worker.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final PaymentRepository paymentRepository;
    private final MaterialTemplateRepository materialTemplateRepository;
    private final MaterialRepository materialRepository;
    private final WorkerRepository workerRepository;
    private final AttendanceRepository attendanceRepository;
    private final SalaryAdvanceRepository salaryAdvanceRepository;
    private final WarrantyRepository warrantyRepository;
    private final ReminderRepository reminderRepository;
    private final PasswordEncoder passwordEncoder;

    private final Random random = new Random();

    @Override
    public void run(String... args) throws Exception {
        if (projectRepository.count() > 0) {
            log.info("Database already seeded with projects. Skipping seeder...");
            return;
        }

        log.info("🚀 Starting database seeding...");

        // 1. Seed Users (100 users)
        log.info("Seeding 100 users...");
        List<User> users = new ArrayList<>();
        String encodedPassword = passwordEncoder.encode("user123");
        
        // Ensure admin user exists
        User admin = userRepository.findByUsername("admin").orElse(null);
        if (admin == null) {
            admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("Chủ Xưởng")
                    .role(Role.OWNER)
                    .isActive(true)
                    .build();
            admin = userRepository.save(admin);
        }
        users.add(admin);

        for (int i = 1; i <= 99; i++) {
            User user = User.builder()
                    .username("staff_" + i)
                    .password(encodedPassword)
                    .fullName("Nhân viên " + i)
                    .role(random.nextBoolean() ? Role.OWNER : Role.STAFF)
                    .isActive(true)
                    .build();
            users.add(user);
        }
        userRepository.saveAll(users);

        // 2. Seed Projects (100 projects)
        log.info("Seeding 100 projects...");
        List<Project> projects = new ArrayList<>();
        String[] customerNames = {"Nguyễn Văn An", "Trần Thị Bình", "Lê Văn Cường", "Phạm Minh Đức", "Hoàng Thu Thảo", "Vũ Hoàng Nam", "Ngô Quốc Bảo", "Đỗ Kim Liên", "Bùi Tiến Dũng", "Phan Thanh Hằng"};
        String[] addresses = {"123 Cầu Giấy, Hà Nội", "456 Đường Láng, Hà Nội", "789 Nguyễn Trãi, Hà Nội", "12 Lê Lợi, TP. HCM", "34 Trần Hưng Đạo, Đà Nẵng", "56 Nguyễn Văn Linh, Hải Phòng", "78 Lê Hồng Phong, Vinh", "90 Quang Trung, Cần Thơ", "101 Kim Mã, Hà Nội", "202 Giải Phóng, Hà Nội"};
        String[] projectNames = {"Lắp đặt cửa nhôm kính biệt thự", "Thi công vách ngăn kính văn phòng", "Cửa sổ nhôm Xingfa chung cư", "Kính cường lực showroom", "Hệ mặt dựng kính tòa nhà", "Cửa đi nhôm kính cao cấp", "Tủ nhôm kính nhà bếp", "Cửa cuốn khe thoáng xưởng", "Cửa nhôm kính thủy lực", "Kính mái hiên nghệ thuật"};

        LocalDate baseDate = LocalDate.now().minusMonths(6);

        for (int i = 1; i <= 100; i++) {
            BigDecimal length = BigDecimal.valueOf(1.5 + random.nextDouble() * 10).setScale(2, RoundingMode.HALF_UP);
            BigDecimal width = BigDecimal.valueOf(1.5 + random.nextDouble() * 10).setScale(2, RoundingMode.HALF_UP);
            BigDecimal area = length.multiply(width).setScale(2, RoundingMode.HALF_UP);
            BigDecimal unitPrice = BigDecimal.valueOf(800000 + random.nextInt(3200) * 1000);
            BigDecimal totalAmount = area.multiply(unitPrice).setScale(2, RoundingMode.HALF_UP);
            BigDecimal deposit = totalAmount.multiply(BigDecimal.valueOf(0.1 + random.nextDouble() * 0.3)).setScale(2, RoundingMode.HALF_UP);
            BigDecimal extraPaid = totalAmount.multiply(BigDecimal.valueOf(0.1 + random.nextDouble() * 0.2)).setScale(2, RoundingMode.HALF_UP);

            LocalDate startDate = baseDate.plusDays(random.nextInt(150));
            LocalDate deliveryDate = startDate.plusDays(10 + random.nextInt(30));

            ProjectStatus status = ProjectStatus.values()[random.nextInt(ProjectStatus.values().length)];

            Project project = Project.builder()
                    .projectCode(String.format("CT-202608-%03d", i))
                    .name(projectNames[random.nextInt(projectNames.length)] + " " + i)
                    .customerName(customerNames[random.nextInt(customerNames.length)])
                    .customerPhone("09" + String.format("%08d", random.nextInt(100000000)))
                    .address(addresses[random.nextInt(addresses.length)])
                    .lengthM(length)
                    .widthM(width)
                    .areaM2(area)
                    .unitPrice(unitPrice)
                    .totalAmount(totalAmount)
                    .deposit(deposit)
                    .extraPaid(extraPaid)
                    .status(status)
                    .startDate(startDate)
                    .deliveryDate(deliveryDate)
                    .note("Ghi chú cho công trình thứ " + i)
                    .createdBy(users.get(random.nextInt(users.size())))
                    .build();
            projects.add(project);
        }
        projects = projectRepository.saveAll(projects);

        // 3. Seed Payments (100 payments)
        log.info("Seeding 100 payments...");
        List<Payment> payments = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            Project project = projects.get(random.nextInt(projects.size()));
            BigDecimal amount = project.getTotalAmount().multiply(BigDecimal.valueOf(0.1 + random.nextDouble() * 0.2)).setScale(2, RoundingMode.HALF_UP);
            PaymentType type = PaymentType.values()[random.nextInt(PaymentType.values().length)];

            Payment payment = Payment.builder()
                    .project(project)
                    .amount(amount)
                    .type(type)
                    .note("Đợt thanh toán " + (i + 1) + " cho " + project.getProjectCode())
                    .paidAt(LocalDateTime.now().minusDays(random.nextInt(100)))
                    .build();
            payments.add(payment);
        }
        paymentRepository.saveAll(payments);

        // 4. Seed Material Templates (100 templates)
        log.info("Seeding 100 material templates...");
        List<MaterialTemplate> templates = new ArrayList<>();
        String[] materialNames = {"Nhôm hộp Xingfa", "Nhôm thanh Xingfa", "Kính cường lực 10mm", "Kính dán an toàn 8.38mm", "Bản lề thủy lực", "Tay nắm cửa kính", "Keo silicone Apollo", "Gioăng cao su chống nước", "Vít tự khoan inox", "Khóa cửa nhôm"};
        String[] units = {"cây", "m²", "bộ", "chai", "cuộn", "hộp"};

        long existingTemplateCount = materialTemplateRepository.count();
        int templatesToGenerate = (int) (100 - existingTemplateCount);
        for (int i = 1; i <= templatesToGenerate; i++) {
            String name = materialNames[random.nextInt(materialNames.length)] + " loại " + (existingTemplateCount + i);
            String unit = units[random.nextInt(units.length)];
            BigDecimal price = BigDecimal.valueOf(10000 + random.nextInt(490) * 1000);

            MaterialTemplate template = MaterialTemplate.builder()
                    .name(name)
                    .unit(unit)
                    .defaultPrice(price)
                    .isActive(true)
                    .build();
            templates.add(template);
        }
        materialTemplateRepository.saveAll(templates);

        List<MaterialTemplate> allTemplates = materialTemplateRepository.findAll();

        // 5. Seed Materials (100 materials)
        log.info("Seeding 100 project materials...");
        List<Material> materials = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            Project project = projects.get(random.nextInt(projects.size()));
            MaterialTemplate template = allTemplates.get(random.nextInt(allTemplates.size()));
            BigDecimal qty = BigDecimal.valueOf(5 + random.nextInt(100)).setScale(3, RoundingMode.HALF_UP);
            BigDecimal price = template.getDefaultPrice();

            Material material = Material.builder()
                    .project(project)
                    .name(template.getName())
                    .unit(template.getUnit())
                    .quantity(qty)
                    .unitPrice(price)
                    .note("Nguyên vật liệu dự án " + project.getProjectCode())
                    .build();
            materials.add(material);
        }
        materialRepository.saveAll(materials);

        // 6. Seed Workers (100 workers)
        log.info("Seeding 100 workers...");
        List<Worker> workers = new ArrayList<>();
        String[] workerNames = {"Trần Văn Hùng", "Lê Đình Thắng", "Phạm Văn Nam", "Nguyễn Quốc Việt", "Vũ Tiến Anh", "Hoàng Văn Lâm", "Bùi Văn Sơn", "Đặng Quang Huy", "Đỗ Văn Hải", "Nguyễn Hữu Tài"};
        for (int i = 1; i <= 100; i++) {
            Worker worker = Worker.builder()
                    .name(workerNames[random.nextInt(workerNames.length)] + " " + i)
                    .phone("09" + String.format("%08d", random.nextInt(100000000)))
                    .dailyWage(BigDecimal.valueOf(250000 + random.nextInt(25) * 10000))
                    .isActive(true)
                    .note("Thợ có kinh nghiệm tốt " + i)
                    .build();
            workers.add(worker);
        }
        workers = workerRepository.saveAll(workers);

        // 7. Seed Attendance (100 attendance records)
        log.info("Seeding 100 attendance records...");
        List<Attendance> attendances = new ArrayList<>();
        LocalDate attendBaseDate = LocalDate.now().minusDays(15);
        for (int i = 0; i < 100; i++) {
            Worker worker = workers.get(i % workers.size());
            LocalDate workDate = attendBaseDate.plusDays(i / workers.size());

            Attendance attendance = Attendance.builder()
                    .worker(worker)
                    .workDate(workDate)
                    .isPresent(random.nextDouble() > 0.1)
                    .note("Chấm công ngày " + workDate)
                    .build();
            attendances.add(attendance);
        }
        attendanceRepository.saveAll(attendances);

        // 8. Seed Salary Advances (100 advances)
        log.info("Seeding 100 salary advances...");
        List<SalaryAdvance> advances = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            Worker worker = workers.get(random.nextInt(workers.size()));
            BigDecimal amount = BigDecimal.valueOf(100000 + random.nextInt(19) * 50000);
            LocalDate advDate = LocalDate.now().minusDays(random.nextInt(30));

            SalaryAdvance advance = SalaryAdvance.builder()
                    .worker(worker)
                    .amount(amount)
                    .advanceDate(advDate)
                    .note("Tạm ứng lương lần " + (i + 1))
                    .build();
            advances.add(advance);
        }
        salaryAdvanceRepository.saveAll(advances);

        // 9. Seed Warranties (100 warranties)
        log.info("Seeding 100 warranties...");
        List<Warranty> warranties = new ArrayList<>();
        String[] issues = {"Kính bị bám hơi nước bên trong", "Cửa đóng bị kẹt xệ cánh", "Gioăng cao su bị bong ở góc", "Bản lề bị rỉ sét kêu rít", "Tay nắm cửa bị lỏng ốc vít", "Khóa chốt khó vặn", "Bánh xe trượt bị rít", "Keo silicon bị hở"};
        for (int i = 0; i < 100; i++) {
            Project project = projects.get(random.nextInt(projects.size()));
            LocalDate warDate = project.getDeliveryDate().plusMonths(1 + random.nextInt(3));
            boolean isResolved = random.nextBoolean();
            LocalDate resDate = isResolved ? warDate.plusDays(2 + random.nextInt(7)) : null;

            Warranty warranty = Warranty.builder()
                    .project(project)
                    .warrantyDate(warDate)
                    .issue(issues[random.nextInt(issues.length)] + " - yêu cầu bảo trì " + i)
                    .isResolved(isResolved)
                    .resolvedAt(resDate)
                    .note("Xử lý sự cố kỹ thuật số " + i)
                    .build();
            warranties.add(warranty);
        }
        warrantyRepository.saveAll(warranties);

        // 10. Seed Reminders (100 reminders)
        log.info("Seeding 100 reminders...");
        List<Reminder> reminders = new ArrayList<>();
        String[] reminderTitles = {"Giao hàng và nghiệm thu công trình", "Thu tiền cọc đợt kế tiếp", "Kiểm tra chất lượng định kỳ", "Bảo trì định kỳ sau lắp đặt", "Họp công trình với thợ", "Mua bổ sung phụ kiện nhôm"};
        for (int i = 0; i < 100; i++) {
            Project project = projects.get(random.nextInt(projects.size()));
            LocalDateTime remindTime = LocalDateTime.now().plusDays(random.nextInt(30)).plusHours(random.nextInt(24));
            ReminderType type = ReminderType.values()[random.nextInt(ReminderType.values().length)];

            Reminder reminder = Reminder.builder()
                    .title(reminderTitles[random.nextInt(reminderTitles.length)] + " " + i)
                    .remindAt(remindTime)
                    .type(type)
                    .isDone(random.nextBoolean())
                    .project(project)
                    .note("Lời nhắc tự động cho " + project.getProjectCode())
                    .build();
            reminders.add(reminder);
        }
        reminderRepository.saveAll(reminders);

        log.info("✨ Database seeding completed successfully!");
    }
}
