package com.jarod.fintrack.controller;

import com.jarod.fintrack.dto.CategoriaDTO;
import com.jarod.fintrack.service.CategoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService categoriaService;

    @GetMapping
    public ResponseEntity<List<CategoriaDTO>> listar(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(categoriaService.listar(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<CategoriaDTO> crear(@AuthenticationPrincipal UserDetails userDetails,
                                              @Valid @RequestBody CategoriaDTO dto) {
        return ResponseEntity.ok(categoriaService.crear(userDetails.getUsername(), dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaDTO> actualizar(@AuthenticationPrincipal UserDetails userDetails,
                                                   @PathVariable UUID id,
                                                   @Valid @RequestBody CategoriaDTO dto) {
        return ResponseEntity.ok(categoriaService.actualizar(userDetails.getUsername(), id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@AuthenticationPrincipal UserDetails userDetails,
                                         @PathVariable UUID id) {
        categoriaService.eliminar(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}