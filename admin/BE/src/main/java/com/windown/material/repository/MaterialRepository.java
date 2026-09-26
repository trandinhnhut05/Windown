package com.windown.material.repository;

import com.windown.material.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByProjectId(Long projectId);

    @Query("SELECT COALESCE(SUM(m.quantity * m.unitPrice), 0) FROM Material m WHERE m.project.id = :projectId")
    BigDecimal sumTotalByProjectId(@Param("projectId") Long projectId);

    // Queries for financial charts
    @Query("""
        SELECT COALESCE(SUM(m.quantity * m.unitPrice), 0)
        FROM Material m
        WHERE m.project.status != 'CANCELLED'
        AND YEAR(m.project.createdAt) = :year
        AND MONTH(m.project.createdAt) = :month
        """)
    BigDecimal sumTotalCostByMonth(@Param("year") int year, @Param("month") int month);
}
