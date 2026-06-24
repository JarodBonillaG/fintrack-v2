package com.jarod.fintrack.dto;

import com.jarod.fintrack.entity.presupuesto.Periodo;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PresupuestoDTO {
    private UUID id;
    @NotNull
    private UUID categoriaId;
    @NotNull
    private BigDecimal montoLimite;
    private Periodo periodo;
}