package com.windown.worker.repository;

import com.windown.worker.entity.PieceworkCompensation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PieceworkCompensationRepository extends JpaRepository<PieceworkCompensation, Long> {

    List<PieceworkCompensation> findByWorkerIdOrderByWorkDateDesc(Long workerId);

    List<PieceworkCompensation> findByWorkerIdAndWorkDateBetweenOrderByWorkDateDesc(Long workerId, LocalDate start, LocalDate end);

    @Query("SELECT SUM(p.amount) FROM PieceworkCompensation p WHERE p.worker.id = :workerId AND p.workDate BETWEEN :start AND :end")
    BigDecimal sumAmountByWorkerIdAndDateBetween(Long workerId, LocalDate start, LocalDate end);
}
