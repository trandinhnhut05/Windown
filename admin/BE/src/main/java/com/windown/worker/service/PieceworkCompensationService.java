package com.windown.worker.service;

import com.windown.common.exception.AppException;
import com.windown.project.entity.Project;
import com.windown.project.repository.ProjectRepository;
import com.windown.worker.dto.PieceworkRequest;
import com.windown.worker.dto.PieceworkResponse;
import com.windown.worker.entity.PieceworkCompensation;
import com.windown.worker.entity.Worker;
import com.windown.worker.repository.PieceworkCompensationRepository;
import com.windown.worker.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PieceworkCompensationService {

    private final PieceworkCompensationRepository pieceworkRepository;
    private final WorkerRepository workerRepository;
    private final ProjectRepository projectRepository;

    public List<PieceworkResponse> getPieceworksByWorkerId(Long workerId) {
        return pieceworkRepository.findByWorkerIdOrderByWorkDateDesc(workerId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public PieceworkResponse createPiecework(Long workerId, PieceworkRequest request) {
        Worker worker = workerRepository.findById(workerId)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy thợ #" + workerId));

        Project project = null;
        if (request.projectId() != null) {
            project = projectRepository.findById(request.projectId())
                    .orElseThrow(() -> AppException.notFound("Không tìm thấy công trình #" + request.projectId()));
        }

        PieceworkCompensation piecework = PieceworkCompensation.builder()
                .worker(worker)
                .project(project)
                .description(request.description())
                .quantity(request.quantity())
                .unitPrice(request.unitPrice())
                .workDate(request.workDate())
                .build();

        return toResponse(pieceworkRepository.save(piecework));
    }

    @Transactional
    public void deletePiecework(Long id) {
        if (!pieceworkRepository.existsById(id)) {
            throw AppException.notFound("Không tìm thấy khoản công khoán #" + id);
        }
        pieceworkRepository.deleteById(id);
    }

    private PieceworkResponse toResponse(PieceworkCompensation p) {
        return new PieceworkResponse(
                p.getId(),
                p.getWorker().getId(),
                p.getWorker().getName(),
                p.getProject() != null ? p.getProject().getId() : null,
                p.getProject() != null ? p.getProject().getProjectCode() : null,
                p.getProject() != null ? p.getProject().getName() : null,
                p.getDescription(),
                p.getQuantity(),
                p.getUnitPrice(),
                p.getAmount(),
                p.getWorkDate()
        );
    }
}
