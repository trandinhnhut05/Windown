package com.windown.worker.service;

import com.windown.common.exception.AppException;
import com.windown.worker.dto.AttendanceRequest;
import com.windown.worker.dto.AttendanceResponse;
import com.windown.worker.dto.BulkAttendanceRequest;
import com.windown.worker.entity.Attendance;
import com.windown.worker.entity.Worker;
import com.windown.worker.repository.AttendanceRepository;
import com.windown.worker.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final WorkerRepository workerRepository;

    public List<AttendanceResponse> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByWorkDate(date).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<AttendanceResponse> getAttendanceBetween(LocalDate start, LocalDate end) {
        return attendanceRepository.findByWorkDateBetween(start, end).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public List<AttendanceResponse> saveBulkAttendance(BulkAttendanceRequest request) {
        LocalDate workDate = request.workDate();
        List<AttendanceResponse> responses = new ArrayList<>();

        for (AttendanceRequest checkIn : request.checkIns()) {
            Worker worker = workerRepository.findById(checkIn.workerId())
                    .orElseThrow(() -> AppException.notFound("Không tìm thấy thợ #" + checkIn.workerId()));

            Attendance attendance = attendanceRepository.findByWorkerIdAndWorkDate(worker.getId(), workDate)
                    .orElse(null);

            if (attendance != null) {
                attendance.setPresent(checkIn.isPresent());
                attendance.setNote(checkIn.note());
            } else {
                attendance = Attendance.builder()
                        .worker(worker)
                        .workDate(workDate)
                        .isPresent(checkIn.isPresent())
                        .note(checkIn.note())
                        .build();
            }

            responses.add(toResponse(attendanceRepository.save(attendance)));
        }

        return responses;
    }

    private AttendanceResponse toResponse(Attendance a) {
        return new AttendanceResponse(
                a.getId(),
                a.getWorker().getId(),
                a.getWorker().getName(),
                a.getWorkDate(),
                a.isPresent(),
                a.getNote()
        );
    }
}
