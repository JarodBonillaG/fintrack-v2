package com.jarod.fintrack.service;

import com.jarod.fintrack.dto.TransaccionDTO;
import com.jarod.fintrack.entity.categoria;
import com.jarod.fintrack.entity.cuenta;
import com.jarod.fintrack.entity.transaccion;
import com.jarod.fintrack.entity.usuario;
import com.jarod.fintrack.repository.categoriaRepository;
import com.jarod.fintrack.repository.cuentaRepository;
import com.jarod.fintrack.repository.transaccionRepository;
import com.jarod.fintrack.repository.usuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransaccionService {

    private final transaccionRepository transaccionRepository;
    private final cuentaRepository cuentaRepository;
    private final categoriaRepository categoriaRepository;
    private final usuarioRepository usuarioRepository;

    private usuario obtenerUsuario(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));
    }

    private TransaccionDTO toDTO(transaccion t) {
        return new TransaccionDTO(
                t.getId(),
                t.getCuenta().getId(),
                t.getCategoria().getId(),
                t.getMonto(),
                t.getTipo(),
                t.getFecha(),
                t.getDescripcion(),
                t.isEsRecurrente(),
                t.getFrecuencia()
        );
    }

    public List<TransaccionDTO> listar(String email, UUID cuentaId, UUID categoriaId,
                                       LocalDate desde, LocalDate hasta) {
        usuario u = obtenerUsuario(email);
        return transaccionRepository.findByUsuarioWithFilters(u, cuentaId, categoriaId, desde, hasta)
                .stream().map(this::toDTO).toList();
    }

    public TransaccionDTO crear(String email, TransaccionDTO dto) {
        usuario u = obtenerUsuario(email);

        cuenta c = cuentaRepository.findById(dto.getCuentaId())
                .filter(x -> x.getUsuario().getEmail().equals(email))
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));

        categoria cat = categoriaRepository.findById(dto.getCategoriaId())
                .filter(x -> x.getUsuario().getEmail().equals(email))
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        transaccion t = new transaccion();
        t.setCuenta(c);
        t.setCategoria(cat);
        t.setMonto(dto.getMonto());
        t.setTipo(dto.getTipo());
        t.setFecha(dto.getFecha());
        t.setDescripcion(dto.getDescripcion());
        t.setEsRecurrente(dto.isEsRecurrente());
        t.setFrecuencia(dto.getFrecuencia());

        return toDTO(transaccionRepository.save(t));
    }

    public TransaccionDTO actualizar(String email, UUID id, TransaccionDTO dto) {
        transaccion t = transaccionRepository.findById(id)
                .filter(x -> x.getCuenta().getUsuario().getEmail().equals(email))
                .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));

        cuenta c = cuentaRepository.findById(dto.getCuentaId())
                .filter(x -> x.getUsuario().getEmail().equals(email))
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));

        categoria cat = categoriaRepository.findById(dto.getCategoriaId())
                .filter(x -> x.getUsuario().getEmail().equals(email))
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        t.setCuenta(c);
        t.setCategoria(cat);
        t.setMonto(dto.getMonto());
        t.setTipo(dto.getTipo());
        t.setFecha(dto.getFecha());
        t.setDescripcion(dto.getDescripcion());
        t.setEsRecurrente(dto.isEsRecurrente());
        t.setFrecuencia(dto.getFrecuencia());

        return toDTO(transaccionRepository.save(t));
    }

    public void eliminar(String email, UUID id) {
        transaccion t = transaccionRepository.findById(id)
                .filter(x -> x.getCuenta().getUsuario().getEmail().equals(email))
                .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));
        transaccionRepository.delete(t);
    }
}