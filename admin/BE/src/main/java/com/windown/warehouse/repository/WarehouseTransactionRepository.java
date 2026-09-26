package com.windown.warehouse.repository;

import com.windown.warehouse.entity.WarehouseTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WarehouseTransactionRepository extends JpaRepository<WarehouseTransaction, Long> {

    List<WarehouseTransaction> findByItemIdOrderByTransactionDateDesc(Long itemId);

    List<WarehouseTransaction> findTop100ByOrderByTransactionDateDesc();
}
