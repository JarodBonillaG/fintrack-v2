package com.jarod.fintrack.controller;

import com.jarod.fintrack.dto.CuentaDTO;
import com.jarod.fintrack.service.CuentaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cuentas")
@RequiredArgsConstructor
public class CuentaController {

    private final CuentaService cuentaService;

    @GetMapping
    public ResponseEntity<List<CuentaDTO>> listar(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(cuentaService.listar(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<CuentaDTO> crear(@AuthenticationPrincipal UserDetails userDetails,
                                           @Valid @RequestBody CuentaDTO dto) {
        return ResponseEntity.ok(cuentaService.crear(userDetails.getUsername(), dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CuentaDTO> actualizar(@AuthenticationPrincipal UserDetails userDetails,
                                                @PathVariable UUID id,
                                                @Valid @RequestBody CuentaDTO dto) {
        return ResponseEntity.ok(cuentaService.actualizar(userDetails.getUsername(), id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@AuthenticationPrincipal UserDetails userDetails,
                                         @PathVariable UUID id) {
        cuentaService.eliminar(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}