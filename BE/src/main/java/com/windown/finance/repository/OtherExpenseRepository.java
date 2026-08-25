package com.windown.finance.repository;

import com.windown.finance.entity.OtherExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface OtherExpenseRepository extends JpaRepository<OtherExpense, Long> {

    List<OtherExpense> findByExpenseDateBetweenOrderByExpenseDateDesc(LocalDate start, LocalDate end);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM OtherExpense e WHERE YEAR(e.expenseDate) = :year AND MONTH(e.expenseDate) = :month")
    BigDecimal sumExpensesByMonth(@Param("year") int year, @Param("month") int month);
}
