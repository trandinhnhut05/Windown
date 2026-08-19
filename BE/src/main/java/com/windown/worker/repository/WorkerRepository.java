package com.windown.worker.repository;

import com.windown.worker.entity.Worker;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WorkerRepository extends JpaRepository<Worker, Long> {

    @Query("""
        SELECT w FROM Worker w
        WHERE (:isActive IS NULL OR w.isActive = :isActive)
        AND (:keyword IS NULL OR LOWER(w.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
             OR w.phone LIKE CONCAT('%', :keyword, '%'))
        ORDER BY w.name ASC
        """)
    Page<Worker> searchWorkers(
            @Param("isActive") Boolean isActive,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    List<Worker> findByIsActiveTrueOrderByNameAsc();
}
