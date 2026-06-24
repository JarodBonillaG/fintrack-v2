package com.jarod.fintrack.dto;

import com.jarod.fintrack.entity.transaccion.Frecuencia;
import com.jarod.fintrack.entity.transaccion.TipoTransaccion;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransaccionDTO {
    private UUID id;
    @NotNull
    private UUID cuentaId;
    @NotNull
    private UUID categoriaId;
    @NotNull
    private BigDecimal monto;
    @NotNull
    private TipoTransaccion tipo;
    @NotNull
    private LocalDate fecha;
    private String descripcion;
    private boolean esRecurrente;
    private Frecuencia frecuencia;
}