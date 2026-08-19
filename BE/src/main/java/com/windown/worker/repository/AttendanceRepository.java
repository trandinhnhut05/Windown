package com.windown.worker.repository;

import com.windown.worker.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByWorkDate(LocalDate workDate);

    List<Attendance> findByWorkDateBetween(LocalDate start, LocalDate end);

    Optional<Attendance> findByWorkerIdAndWorkDate(Long workerId, LocalDate workDate);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.worker.id = :workerId AND a.workDate BETWEEN :start AND :end AND a.isPresent = true")
    long countPresentDays(
            @Param("workerId") Long workerId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );
}
