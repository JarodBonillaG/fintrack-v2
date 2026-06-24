package com.jarod.fintrack.dto;

import jakarta.validation.constraints.NotBlank;
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
public class MetaAhorroDTO {
    private UUID id;
    @NotBlank
    private String nombre;
    @NotNull
    private BigDecimal montoObjetivo;
    private BigDecimal montoActual;
    private LocalDate fechaLimite;
}