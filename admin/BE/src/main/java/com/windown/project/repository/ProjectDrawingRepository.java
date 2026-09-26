package com.windown.project.repository;

import com.windown.project.entity.ProjectDrawing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectDrawingRepository extends JpaRepository<ProjectDrawing, Long> {
    List<ProjectDrawing> findByProjectIdOrderByUploadedAtDesc(Long projectId);
}
