package com.windown.worker.service;

import com.windown.common.exception.AppException;
import com.windown.worker.dto.WorkerRequest;
import com.windown.worker.dto.WorkerResponse;
import com.windown.worker.entity.Worker;
import com.windown.worker.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WorkerService {

    private final WorkerRepository workerRepository;

    public Page<WorkerResponse> getWorkers(Boolean isActive, String keyword, Pageable pageable) {
        return workerRepository.searchWorkers(isActive, keyword, pageable)
                .map(this::toResponse);
    }

    public List<WorkerResponse> getActiveWorkers() {
        return workerRepository.findByIsActiveTrueOrderByNameAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    public WorkerResponse getById(Long id) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy thợ #" + id));
        return toResponse(worker);
    }

    @Transactional
    public WorkerResponse create(WorkerRequest request) {
        Worker worker = Worker.builder()
                .name(request.name())
                .phone(request.phone())
                .dailyWage(request.dailyWage())
                .isActive(request.isActive() == null || request.isActive())
                .note(request.note())
                .build();

        return toResponse(workerRepository.save(worker));
    }

    @Transactional
    public WorkerResponse update(Long id, WorkerRequest request) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy thợ #" + id));

        worker.setName(request.name());
        worker.setPhone(request.phone());
        worker.setDailyWage(request.dailyWage());
        if (request.isActive() != null) {
            worker.setActive(request.isActive());
        }
        worker.setNote(request.note());

        return toResponse(workerRepository.save(worker));
    }

    @Transactional
    public void delete(Long id) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy thợ #" + id));
        workerRepository.delete(worker);
    }

    private WorkerResponse toResponse(Worker w) {
        return new WorkerResponse(
                w.getId(),
                w.getName(),
                w.getPhone(),
                w.getDailyWage(),
                w.isActive(),
                w.getNote(),
                w.getCreatedAt()
        );
    }
}
