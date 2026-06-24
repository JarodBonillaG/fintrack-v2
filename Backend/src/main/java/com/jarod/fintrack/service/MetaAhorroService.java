package com.jarod.fintrack.service;

import com.jarod.fintrack.dto.MetaAhorroDTO;
import com.jarod.fintrack.entity.metaAhorro;
import com.jarod.fintrack.entity.usuario;
import com.jarod.fintrack.repository.metaAhorroRepository;
import com.jarod.fintrack.repository.usuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MetaAhorroService {

    private final metaAhorroRepository metaAhorroRepository;
    private final usuarioRepository usuarioRepository;

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

    public MetaAhorroDTO aporte(String email, UUID id, BigDecimal monto) {
        metaAhorro m = metaAhorroRepository.findById(id)
                .filter(x -> x.getUsuario().getEmail().equals(email))
                .orElseThrow(() -> new RuntimeException("Meta no encontrada"));
        m.setMontoActual(m.getMontoActual().add(monto));
        return toDTO(metaAhorroRepository.save(m));
    }
}