package com.jarod.fintrack.service;

import com.jarod.fintrack.dto.CuentaDTO;
import com.jarod.fintrack.entity.cuenta;
import com.jarod.fintrack.entity.usuario;
import com.jarod.fintrack.repository.cuentaRepository;
import com.jarod.fintrack.repository.transaccionRepository;
import com.jarod.fintrack.repository.usuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CuentaService {

    private final cuentaRepository cuentaRepository;
    private final usuarioRepository usuarioRepository;
    private final transaccionRepository transaccionRepository;

    private usuario obtenerUsuario(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));
    }

    private CuentaDTO toDTO(cuenta c) {
        return new CuentaDTO(c.getId(), c.getNombre(), c.getTipo(), c.getMoneda(), c.getBalance());
    }

    public List<CuentaDTO> listar(String email) {
        usuario u = obtenerUsuario(email);
        return cuentaRepository.findByUsuario(u).stream().map(this::toDTO).toList();
    }

    public CuentaDTO crear(String email, CuentaDTO dto) {
        usuario u = obtenerUsuario(email);
        cuenta c = new cuenta();
        c.setUsuario(u);
        c.setNombre(dto.getNombre());
        c.setTipo(dto.getTipo());
        c.setMoneda(dto.getMoneda());
        c.setBalance(dto.getBalance() != null ? dto.getBalance() : java.math.BigDecimal.ZERO);
        return toDTO(cuentaRepository.save(c));
    }

    public CuentaDTO actualizar(String email, UUID id, CuentaDTO dto) {
        cuenta c = cuentaRepository.findById(id)
                .filter(x -> x.getUsuario().getEmail().equals(email))
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));
        c.setNombre(dto.getNombre());
        c.setTipo(dto.getTipo());
        c.setMoneda(dto.getMoneda());
        c.setBalance(dto.getBalance());
        return toDTO(cuentaRepository.save(c));
    }
    @Transactional
    public void eliminar(String email, UUID id) {
        cuenta c = cuentaRepository.findById(id)
                .filter(x -> x.getUsuario().getEmail().equals(email))
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));
        transaccionRepository.deleteByCuenta(c);
        cuentaRepository.delete(c);
    }
}