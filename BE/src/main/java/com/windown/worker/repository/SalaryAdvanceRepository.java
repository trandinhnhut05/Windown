package com.windown.worker.repository;

import com.windown.worker.entity.SalaryAdvance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface SalaryAdvanceRepository extends JpaRepository<SalaryAdvance, Long> {

    List<SalaryAdvance> findByWorkerIdOrderByAdvanceDateDesc(Long workerId);

    List<SalaryAdvance> findByWorkerIdAndAdvanceDateBetween(Long workerId, LocalDate start, LocalDate end);

    @Query("SELECT COALESCE(SUM(s.amount), 0) FROM SalaryAdvance s WHERE s.worker.id = :workerId AND s.advanceDate BETWEEN :start AND :end")
    BigDecimal sumAdvancesByWorkerIdAndDateBetween(
            @Param("workerId") Long workerId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );
}
