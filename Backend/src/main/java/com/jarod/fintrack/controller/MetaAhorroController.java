package com.jarod.fintrack.controller;

import com.jarod.fintrack.dto.MetaAhorroDTO;
import com.jarod.fintrack.service.MetaAhorroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/metas")
@RequiredArgsConstructor
public class MetaAhorroController {

    private final MetaAhorroService metaAhorroService;

    @GetMapping
    public ResponseEntity<List<MetaAhorroDTO>> listar(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(metaAhorroService.listar(userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@AuthenticationPrincipal UserDetails userDetails,
                                         @PathVariable UUID id) {
        metaAhorroService.eliminar(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<MetaAhorroDTO> crear(@AuthenticationPrincipal UserDetails userDetails,
                                               @Valid @RequestBody MetaAhorroDTO dto) {
        return ResponseEntity.ok(metaAhorroService.crear(userDetails.getUsername(), dto));
    }

    @PutMapping("/{id}/aporte")
    public ResponseEntity<MetaAhorroDTO> aporte(@AuthenticationPrincipal UserDetails userDetails,
                                                @PathVariable UUID id,
                                                @RequestParam BigDecimal monto,
                                                @RequestParam UUID cuentaId) {
        return ResponseEntity.ok(metaAhorroService.aporte(userDetails.getUsername(), id, monto, cuentaId));
    }
}