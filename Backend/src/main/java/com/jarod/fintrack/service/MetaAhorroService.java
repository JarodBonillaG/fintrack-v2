package com.jarod.fintrack.service;

import com.jarod.fintrack.dto.MetaAhorroDTO;
import com.jarod.fintrack.entity.*;
import com.jarod.fintrack.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MetaAhorroService {

    private final metaAhorroRepository metaAhorroRepository;
    private final usuarioRepository usuarioRepository;
    private final cuentaRepository cuentaRepository;
    private final transaccionRepository transaccionRepository;
    private final categoriaRepository categoriaRepository;

    private usuario obtenerUsuario(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));
    }

    private MetaAhorroDTO toDTO(metaAhorro m) {
        return new MetaAhorroDTO(m.getId(), m.getNombre(), m.getMontoObjetivo(),
                m.getMontoActual(), m.getFechaLimite());
    }

    public List<MetaAhorroDTO> listar(String email) {
        return metaAhorroRepository.findByUsuario(obtenerUsuario(email))
                .stream().map(this::toDTO).toList();
    }

    public MetaAhorroDTO crear(String email, MetaAhorroDTO dto) {
        usuario u = obtenerUsuario(email);
        metaAhorro m = new metaAhorro();
        m.setUsuario(u);
        m.setNombre(dto.getNombre());
        m.setMontoObjetivo(dto.getMontoObjetivo());
        m.setMontoActual(dto.getMontoActual() != null ? dto.getMontoActual() : BigDecimal.ZERO);
        m.setFechaLimite(dto.getFechaLimite());
        return toDTO(metaAhorroRepository.save(m));
    }

    private categoria obtenerOCrearCategoriaAhorro(usuario u) {
        return categoriaRepository.findByUsuarioAndNombreIgnoreCase(u, "Ahorro")
                .orElseGet(() -> {
                    categoria nueva = new categoria();
                    nueva.setUsuario(u);
                    nueva.setNombre("Ahorro");
                    nueva.setTipo(categoria.TipoCategoria.GASTO);
                    nueva.setIcono("🎯");
                    return categoriaRepository.save(nueva);
                });
    }

    @Transactional
    public MetaAhorroDTO aporte(String email, UUID id, BigDecimal monto, UUID cuentaId) {
        usuario u = obtenerUsuario(email);

        metaAhorro m = metaAhorroRepository.findById(id)
                .filter(x -> x.getUsuario().getEmail().equals(email))
                .orElseThrow(() -> new RuntimeException("Meta no encontrada"));

        cuenta c = cuentaRepository.findById(cuentaId)
                .filter(x -> x.getUsuario().getId().equals(u.getId()))
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));

        categoria catAhorro = obtenerOCrearCategoriaAhorro(u);   // ⬅️ NUEVO

        c.setBalance(c.getBalance().subtract(monto));
        cuentaRepository.save(c);

        transaccion t = new transaccion();
        t.setCuenta(c);
        t.setCategoria(catAhorro);   // ⬅️ CAMBIO (antes: null)
        t.setMonto(monto);
        t.setTipo(transaccion.TipoTransaccion.GASTO);
        t.setFecha(LocalDate.now());
        t.setDescripcion("Aporte a meta: " + m.getNombre());
        t.setEsRecurrente(false);
        transaccionRepository.save(t);

        m.setMontoActual(m.getMontoActual().add(monto));
        metaAhorroRepository.save(m);

        return toDTO(m);
    }

    public void eliminar(String email, UUID id) {
        metaAhorro m = metaAhorroRepository.findById(id)
                .filter(x -> x.getUsuario().getEmail().equals(email))
                .orElseThrow(() -> new RuntimeException("Meta no encontrada"));
        metaAhorroRepository.delete(m);
    }
}