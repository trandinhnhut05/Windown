package com.windown.worker.service;

import com.windown.common.exception.AppException;
import com.windown.worker.dto.SalaryAdvanceRequest;
import com.windown.worker.dto.SalaryAdvanceResponse;
import com.windown.worker.entity.SalaryAdvance;
import com.windown.worker.entity.Worker;
import com.windown.worker.repository.SalaryAdvanceRepository;
import com.windown.worker.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SalaryAdvanceService {

    private final SalaryAdvanceRepository salaryAdvanceRepository;
    private final WorkerRepository workerRepository;

    public List<SalaryAdvanceResponse> getAdvancesByWorkerId(Long workerId) {
        if (!workerRepository.existsById(workerId)) {
            throw AppException.notFound("Không tìm thấy thợ #" + workerId);
        }
        return salaryAdvanceRepository.findByWorkerIdOrderByAdvanceDateDesc(workerId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public SalaryAdvanceResponse addAdvance(Long workerId, SalaryAdvanceRequest request) {
        Worker worker = workerRepository.findById(workerId)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy thợ #" + workerId));

        SalaryAdvance advance = SalaryAdvance.builder()
                .worker(worker)
                .amount(request.amount())
                .advanceDate(request.advanceDate())
                .note(request.note())
                .build();

        return toResponse(salaryAdvanceRepository.save(advance));
    }

    @Transactional
    public void deleteAdvance(Long id) {
        SalaryAdvance advance = salaryAdvanceRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy phiếu ứng tiền #" + id));
        salaryAdvanceRepository.delete(advance);
    }

    private SalaryAdvanceResponse toResponse(SalaryAdvance sa) {
        return new SalaryAdvanceResponse(
                sa.getId(),
                sa.getWorker().getId(),
                sa.getWorker().getName(),
                sa.getAmount(),
                sa.getAdvanceDate(),
                sa.getNote(),
                sa.getCreatedAt()
        );
    }
}
