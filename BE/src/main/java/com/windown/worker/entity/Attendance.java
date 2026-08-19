package com.windown.worker.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "attendance", uniqueConstraints = {
        @UniqueConstraint(name = "uq_worker_date", columnNames = {"worker_id", "work_date"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    @Column(name = "work_date", nullable = false)
    private LocalDate workDate;

    @Column(name = "is_present", nullable = false)
    @Builder.Default
    private boolean isPresent = true;

    @Column(length = 200)
    private String note;
}
