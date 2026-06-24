package com.jarod.fintrack.service;

import com.jarod.fintrack.dto.PresupuestoDTO;
import com.jarod.fintrack.dto.PresupuestoProgresoDTO;
import com.jarod.fintrack.entity.categoria;
import com.jarod.fintrack.entity.presupuesto;
import com.jarod.fintrack.entity.transaccion.TipoTransaccion;
import com.jarod.fintrack.repository.categoriaRepository;
import com.jarod.fintrack.repository.presupuestoRepository;
import com.jarod.fintrack.repository.transaccionRepository;
import com.jarod.fintrack.repository.usuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PresupuestoService {

    private final presupuestoRepository presupuestoRepository;
    private final categoriaRepository categoriaRepository;
    private final transaccionRepository transaccionRepository;
    private final usuarioRepository usuarioRepository;

    private PresupuestoDTO toDTO(presupuesto p) {
        return new PresupuestoDTO(p.getId(), p.getCategoria().getId(), p.getMontoLimite(), p.getPeriodo());
    }

    public List<PresupuestoDTO> listar(String email) {
        return presupuestoRepository.findByUsuarioEmail(email)
                .stream().map(this::toDTO).toList();
    }

    public PresupuestoDTO crear(String email, PresupuestoDTO dto) {
        categoria cat = categoriaRepository.findById(dto.getCategoriaId())
                .filter(x -> x.getUsuario().getEmail().equals(email))
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        presupuesto p = new presupuesto();
        p.setCategoria(cat);
        p.setMontoLimite(dto.getMontoLimite());
        p.setPeriodo(dto.getPeriodo() != null ? dto.getPeriodo() : presupuesto.Periodo.MENSUAL);
        return toDTO(presupuestoRepository.save(p));
    }

    public PresupuestoProgresoDTO progreso(String email, UUID categoriaId) {
        categoria cat = categoriaRepository.findById(categoriaId)
                .filter(x -> x.getUsuario().getEmail().equals(email))
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        presupuesto p = presupuestoRepository.findByCategoria(cat)
                .orElseThrow(() -> new RuntimeException("Presupuesto no encontrado"));

        LocalDate ahora = LocalDate.now();
        LocalDate desde = ahora.withDayOfMonth(1);
        LocalDate hasta = ahora.withDayOfMonth(ahora.lengthOfMonth());

        BigDecimal gastado = transaccionRepository
                .findByUsuarioWithFilters(cat.getUsuario(), null, categoriaId, desde, hasta)
                .stream()
                .filter(t -> t.getTipo() == TipoTransaccion.GASTO)
                .map(t -> t.getMonto())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal disponible = p.getMontoLimite().subtract(gastado);
        return new PresupuestoProgresoDTO(
                categoriaId,
                cat.getNombre(),
                p.getMontoLimite(),
                gastado,
                disponible,
                gastado.compareTo(p.getMontoLimite()) > 0
        );
    }
}