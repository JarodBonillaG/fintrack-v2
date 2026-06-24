package com.jarod.fintrack.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "transacciones")
@Getter
@Setter
@NoArgsConstructor
public class transaccion {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cuenta_id", nullable = false)
    private cuenta cuenta;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id", nullable = false)
    private categoria categoria;

    @NotNull
    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal monto;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoTransaccion tipo;

    @NotNull
    @Column(nullable = false)
    private LocalDate fecha;

    private String descripcion;

    @Column(name = "es_recurrente", nullable = false)
    private boolean esRecurrente = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "frecuencia")
    private Frecuencia frecuencia;

    public enum TipoTransaccion { INGRESO, GASTO }
    public enum Frecuencia { DIARIA, SEMANAL, MENSUAL, ANUAL }
}