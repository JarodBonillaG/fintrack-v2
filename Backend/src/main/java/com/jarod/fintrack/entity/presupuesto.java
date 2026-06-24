package com.jarod.fintrack.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "presupuestos")
@Getter
@Setter
@NoArgsConstructor
public class presupuesto {

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id", nullable = false, unique = true)
    private categoria categoria;

    @NotNull
    @Column(name = "monto_limite", nullable = false, precision = 19, scale = 4)
    private BigDecimal montoLimite;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Periodo periodo = Periodo.MENSUAL;

    public enum Periodo { SEMANAL, MENSUAL, ANUAL }
}