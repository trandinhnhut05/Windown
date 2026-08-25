package com.windown.worker.service;

import com.windown.worker.dto.PayrollResponse;
import com.windown.worker.entity.Attendance;
import com.windown.worker.entity.Worker;
import com.windown.worker.repository.AttendanceRepository;
import com.windown.worker.repository.PieceworkCompensationRepository;
import com.windown.worker.repository.SalaryAdvanceRepository;
import com.windown.worker.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
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
    private final PieceworkCompensationRepository pieceworkRepository;

    public List<PayrollResponse> calculateMonthlyPayroll(int year, int month) {
        LocalDate start = YearMonth.of(year, month).atDay(1);
        LocalDate end = YearMonth.of(year, month).atEndOfMonth();

        // Calculate for all workers
        List<Worker> workers = workerRepository.findAll();
        List<PayrollResponse> payrolls = new ArrayList<>();

        for (Worker worker : workers) {
            List<Attendance> monthlyAttendances = attendanceRepository.findByWorkerIdAndWorkDateBetween(worker.getId(), start, end);
            BigDecimal totalAdvanced = salaryAdvanceRepository.sumAdvancesByWorkerIdAndDateBetween(worker.getId(), start, end);
            if (totalAdvanced == null) {
                totalAdvanced = BigDecimal.ZERO;
            }

            BigDecimal totalPiecework = pieceworkRepository.sumAmountByWorkerIdAndDateBetween(worker.getId(), start, end);
            if (totalPiecework == null) {
                totalPiecework = BigDecimal.ZERO;
            }

            double presentDaysEquivalent = 0.0;
            double totalOtHours = 0.0;
            BigDecimal totalEarnedFromAttendance = BigDecimal.ZERO;
            BigDecimal hourlyRate = worker.getDailyWage().divide(BigDecimal.valueOf(8.0), 4, RoundingMode.HALF_UP);

            for (Attendance att : monthlyAttendances) {
                if (att.isPresent()) {
                    double hours = att.getHoursWorked() != null ? att.getHoursWorked() : 8.0;
                    double ot = att.getOtHours() != null ? att.getOtHours() : 0.0;
                    double coeff = att.getOtCoefficient() != null ? att.getOtCoefficient() : 1.5;

                    BigDecimal stdAmount = hourlyRate.multiply(BigDecimal.valueOf(hours));
                    BigDecimal otAmount = hourlyRate.multiply(BigDecimal.valueOf(ot)).multiply(BigDecimal.valueOf(coeff));

                    totalEarnedFromAttendance = totalEarnedFromAttendance.add(stdAmount).add(otAmount);
                    presentDaysEquivalent += hours / 8.0;
                    totalOtHours += ot;
                }
            }

            BigDecimal totalEarned = totalEarnedFromAttendance.add(totalPiecework);
            BigDecimal remainingSalary = totalEarned.subtract(totalAdvanced);

            // Compute payroll only if they are active OR worked OR took an advance or piecework this month
            if (monthlyAttendances.size() > 0 || totalAdvanced.compareTo(BigDecimal.ZERO) > 0 || totalPiecework.compareTo(BigDecimal.ZERO) > 0 || worker.isActive()) {
                BigDecimal dailyWage = worker.getDailyWage();
                payrolls.add(new PayrollResponse(
                        worker.getId(),
                        worker.getName(),
                        dailyWage,
                        presentDaysEquivalent,
                        totalOtHours,
                        totalEarnedFromAttendance.setScale(2, RoundingMode.HALF_UP),
                        totalPiecework.setScale(2, RoundingMode.HALF_UP),
                        totalEarned.setScale(2, RoundingMode.HALF_UP),
                        totalAdvanced.setScale(2, RoundingMode.HALF_UP),
                        remainingSalary.setScale(2, RoundingMode.HALF_UP)
                ));
            }
        }

        return payrolls;
    }
}
