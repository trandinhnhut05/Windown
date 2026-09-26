package com.windown.project.repository;

import com.windown.project.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    Optional<Project> findByProjectCode(String projectCode);

    @Query("""
        SELECT p FROM Project p
        WHERE (:status IS NULL OR p.status = :status)
        AND (:keyword IS NULL OR LOWER(p.customerName) LIKE LOWER(CONCAT('%', :keyword, '%'))
             OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
             OR p.customerPhone LIKE CONCAT('%', :keyword, '%'))
        ORDER BY p.createdAt DESC
        """)
    Page<Project> searchProjects(
            @Param("status") Project.ProjectStatus status,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    @Query("SELECT COUNT(p) FROM Project p WHERE p.status = :status")
    long countByStatus(@Param("status") Project.ProjectStatus status);

    @Query("SELECT COALESCE(SUM(p.totalAmount), 0) FROM Project p")
    java.math.BigDecimal sumTotalRevenue();

    @Query("SELECT COALESCE(SUM(p.totalAmount - p.deposit - p.extraPaid), 0) FROM Project p WHERE p.status != 'COMPLETED' AND p.status != 'CANCELLED'")
    java.math.BigDecimal sumTotalDebt();

    @Query("""
        SELECT COALESCE(SUM(p.totalAmount), 0)
        FROM Project p
        WHERE p.status != 'CANCELLED'
        AND YEAR(p.createdAt) = :year
        AND MONTH(p.createdAt) = :month
        """)
    java.math.BigDecimal sumTotalRevenueByMonth(@Param("year") int year, @Param("month") int month);
}
