package com.windown.material.repository;

import com.windown.material.entity.MaterialTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MaterialTemplateRepository extends JpaRepository<MaterialTemplate, Long> {
    List<MaterialTemplate> findByIsActiveTrue();

    @Query("SELECT t FROM MaterialTemplate t WHERE t.isActive = true AND LOWER(t.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<MaterialTemplate> searchTemplates(@Param("keyword") String keyword);
}
