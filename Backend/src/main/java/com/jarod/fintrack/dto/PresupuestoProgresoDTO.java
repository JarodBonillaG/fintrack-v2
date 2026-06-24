package com.jarod.fintrack.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
public class PresupuestoProgresoDTO {
    private UUID categoriaId;
    private String categoriaNombre;
    private BigDecimal montoLimite;
    private BigDecimal montoGastado;
    private BigDecimal montoDisponible;
    private boolean excedido;
}