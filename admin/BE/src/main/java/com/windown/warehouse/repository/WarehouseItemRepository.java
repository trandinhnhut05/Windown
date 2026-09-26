package com.windown.warehouse.repository;

import com.windown.warehouse.entity.ItemCategory;
import com.windown.warehouse.entity.WarehouseItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface WarehouseItemRepository extends JpaRepository<WarehouseItem, Long> {

    Optional<WarehouseItem> findByCode(String code);

    boolean existsByCode(String code);

    boolean existsByCodeAndIdNot(String code, Long id);

    List<WarehouseItem> findByIsActiveTrueOrderByCreatedAtDesc();

    @Query("SELECT i FROM WarehouseItem i WHERE i.isActive = true " +
           "AND (:category IS NULL OR i.category = :category) " +
           "AND (:keyword IS NULL OR LOWER(i.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(i.code) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:lowStockOnly IS NULL OR :lowStockOnly = false OR i.currentStock <= i.minStock) " +
           "ORDER BY i.updatedAt DESC")
    List<WarehouseItem> searchItems(
            @Param("keyword") String keyword,
            @Param("category") ItemCategory category,
            @Param("lowStockOnly") Boolean lowStockOnly
    );

    @Query("SELECT COUNT(i) FROM WarehouseItem i WHERE i.isActive = true AND i.currentStock <= i.minStock")
    long countLowStockItems();

    @Query("SELECT COALESCE(SUM(i.currentStock * i.costPrice), 0) FROM WarehouseItem i WHERE i.isActive = true")
    BigDecimal calculateTotalStockValue();
}
