package com.jarod.fintrack.dto;

import com.jarod.fintrack.entity.cuenta.Moneda;
import com.jarod.fintrack.entity.cuenta.TipoCuenta;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CuentaDTO {

    private UUID id;

    @NotBlank
    private String nombre;

    @NotNull
    private TipoCuenta tipo;

    @NotNull
    private Moneda moneda;

    private BigDecimal balance;
}