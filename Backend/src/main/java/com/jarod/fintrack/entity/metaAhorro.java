package com.jarod.fintrack.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "metas_ahorro")
@Getter
@Setter
@NoArgsConstructor
public class metaAhorro {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private usuario usuario;

    @NotBlank
    @Column(nullable = false)
    private String nombre;

    @NotNull
    @Column(name = "monto_objetivo", nullable = false, precision = 19, scale = 4)
    private BigDecimal montoObjetivo;

    @NotNull
    @Column(name = "monto_actual", nullable = false, precision = 19, scale = 4)
    private BigDecimal montoActual = BigDecimal.ZERO;

    @Column(name = "fecha_limite")
    private LocalDate fechaLimite;
}