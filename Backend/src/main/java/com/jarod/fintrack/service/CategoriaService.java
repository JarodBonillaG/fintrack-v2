package com.jarod.fintrack.service;

import com.jarod.fintrack.dto.CategoriaDTO;
import com.jarod.fintrack.entity.categoria;
import com.jarod.fintrack.entity.usuario;
import com.jarod.fintrack.repository.categoriaRepository;
import com.jarod.fintrack.repository.usuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final categoriaRepository categoriaRepository;
    private final usuarioRepository usuarioRepository;

    private usuario obtenerUsuario(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));
    }

    private CategoriaDTO toDTO(categoria c) {
        return new CategoriaDTO(c.getId(), c.getNombre(), c.getTipo(), c.getIcono());
    }

    public List<CategoriaDTO> listar(String email) {
        return categoriaRepository.findByUsuario(obtenerUsuario(email))
                .stream().map(this::toDTO).toList();
    }

    public CategoriaDTO crear(String email, CategoriaDTO dto) {
        usuario u = obtenerUsuario(email);
        categoria c = new categoria();
        c.setUsuario(u);
        c.setNombre(dto.getNombre());
        c.setTipo(dto.getTipo());
        c.setIcono(dto.getIcono());
        return toDTO(categoriaRepository.save(c));
    }

    public CategoriaDTO actualizar(String email, UUID id, CategoriaDTO dto) {
        categoria c = categoriaRepository.findById(id)
                .filter(x -> x.getUsuario().getEmail().equals(email))
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        c.setNombre(dto.getNombre());
        c.setTipo(dto.getTipo());
        c.setIcono(dto.getIcono());
        return toDTO(categoriaRepository.save(c));
    }

    public void eliminar(String email, UUID id) {
        categoria c = categoriaRepository.findById(id)
                .filter(x -> x.getUsuario().getEmail().equals(email))
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        categoriaRepository.delete(c);
    }
}