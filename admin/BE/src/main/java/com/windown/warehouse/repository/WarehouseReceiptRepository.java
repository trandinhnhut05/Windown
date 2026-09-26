package com.windown.warehouse.repository;

import com.windown.warehouse.entity.ReceiptType;
import com.windown.warehouse.entity.WarehouseReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WarehouseReceiptRepository extends JpaRepository<WarehouseReceipt, Long> {

    Optional<WarehouseReceipt> findByCode(String code);

    boolean existsByCode(String code);

    @Query("SELECT r FROM WarehouseReceipt r WHERE " +
           "(:type IS NULL OR r.type = :type) AND " +
           "(:startDate IS NULL OR r.receiptDate >= :startDate) AND " +
           "(:endDate IS NULL OR r.receiptDate <= :endDate) AND " +
           "(:projectId IS NULL OR (r.project IS NOT NULL AND r.project.id = :projectId)) " +
           "ORDER BY r.receiptDate DESC, r.id DESC")
    List<WarehouseReceipt> searchReceipts(
            @Param("type") ReceiptType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("projectId") Long projectId
    );

    @Query("SELECT COUNT(r) FROM WarehouseReceipt r WHERE r.type = :type " +
           "AND YEAR(r.receiptDate) = :year AND MONTH(r.receiptDate) = :month")
    long countByTypeAndMonth(@Param("type") ReceiptType type, @Param("year") int year, @Param("month") int month);

    @Query("SELECT COALESCE(SUM(r.totalAmount), 0) FROM WarehouseReceipt r WHERE r.type = :type " +
           "AND YEAR(r.receiptDate) = :year AND MONTH(r.receiptDate) = :month")
    BigDecimal sumAmountByTypeAndMonth(@Param("type") ReceiptType type, @Param("year") int year, @Param("month") int month);
}
