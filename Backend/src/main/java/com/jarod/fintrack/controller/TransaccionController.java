package com.jarod.fintrack.controller;

import com.jarod.fintrack.dto.TransaccionDTO;
import com.jarod.fintrack.service.TransaccionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transacciones")
@RequiredArgsConstructor
public class TransaccionController {

    private final TransaccionService transaccionService;

    @GetMapping
    public ResponseEntity<List<TransaccionDTO>> listar(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) UUID cuentaId,
            @RequestParam(required = false) UUID categoriaId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        return ResponseEntity.ok(transaccionService.listar(
                userDetails.getUsername(), cuentaId, categoriaId, desde, hasta));
    }

    @PostMapping
    public ResponseEntity<TransaccionDTO> crear(@AuthenticationPrincipal UserDetails userDetails,
                                                @Valid @RequestBody TransaccionDTO dto) {
        return ResponseEntity.ok(transaccionService.crear(userDetails.getUsername(), dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransaccionDTO> actualizar(@AuthenticationPrincipal UserDetails userDetails,
                                                     @PathVariable UUID id,
                                                     @Valid @RequestBody TransaccionDTO dto) {
        return ResponseEntity.ok(transaccionService.actualizar(userDetails.getUsername(), id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@AuthenticationPrincipal UserDetails userDetails,
                                         @PathVariable UUID id) {
        transaccionService.eliminar(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}