package com.windown.material.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "material_templates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 30)
    private String unit;

    @Column(name = "default_price", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal defaultPrice = BigDecimal.ZERO;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;
}
