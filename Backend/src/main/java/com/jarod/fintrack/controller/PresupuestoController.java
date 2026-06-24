package com.jarod.fintrack.controller;

import com.jarod.fintrack.dto.PresupuestoDTO;
import com.jarod.fintrack.dto.PresupuestoProgresoDTO;
import com.jarod.fintrack.service.PresupuestoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/presupuestos")
@RequiredArgsConstructor
public class PresupuestoController {

    private final PresupuestoService presupuestoService;

    @GetMapping
    public ResponseEntity<List<PresupuestoDTO>> listar(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(presupuestoService.listar(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<PresupuestoDTO> crear(@AuthenticationPrincipal UserDetails userDetails,
                                                @Valid @RequestBody PresupuestoDTO dto) {
        return ResponseEntity.ok(presupuestoService.crear(userDetails.getUsername(), dto));
    }

    @GetMapping("/{categoriaId}/progreso")
    public ResponseEntity<PresupuestoProgresoDTO> progreso(@AuthenticationPrincipal UserDetails userDetails,
                                                           @PathVariable UUID categoriaId) {
        return ResponseEntity.ok(presupuestoService.progreso(userDetails.getUsername(), categoriaId));
    }
}
