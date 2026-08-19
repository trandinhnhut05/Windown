package com.windown.worker.service;

import com.windown.worker.dto.PayrollResponse;
import com.windown.worker.entity.Worker;
import com.windown.worker.repository.AttendanceRepository;
import com.windown.worker.repository.SalaryAdvanceRepository;
import com.windown.worker.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PayrollService {

    private final WorkerRepository workerRepository;
    private final AttendanceRepository attendanceRepository;
    private final SalaryAdvanceRepository salaryAdvanceRepository;

    public List<PayrollResponse> calculateMonthlyPayroll(int year, int month) {
        LocalDate start = YearMonth.of(year, month).atDay(1);
        LocalDate end = YearMonth.of(year, month).atEndOfMonth();

        // Calculate for all workers
        List<Worker> workers = workerRepository.findAll();
        List<PayrollResponse> payrolls = new ArrayList<>();

        for (Worker worker : workers) {
            long presentDays = attendanceRepository.countPresentDays(worker.getId(), start, end);
            BigDecimal totalAdvanced = salaryAdvanceRepository.sumAdvancesByWorkerIdAndDateBetween(worker.getId(), start, end);

            // Compute payroll only if they are active OR worked OR took an advance this month
            if (presentDays > 0 || totalAdvanced.compareTo(BigDecimal.ZERO) > 0 || worker.isActive()) {
                BigDecimal dailyWage = worker.getDailyWage();
                BigDecimal totalEarned = dailyWage.multiply(BigDecimal.valueOf(presentDays));
                BigDecimal remainingSalary = totalEarned.subtract(totalAdvanced);

                payrolls.add(new PayrollResponse(
                        worker.getId(),
                        worker.getName(),
                        dailyWage,
                        presentDays,
                        totalEarned,
                        totalAdvanced,
                        remainingSalary
                ));
            }
        }

        return payrolls;
    }
}
