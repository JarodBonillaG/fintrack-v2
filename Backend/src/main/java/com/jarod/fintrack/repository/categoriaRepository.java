package com.jarod.fintrack.repository;

import com.jarod.fintrack.entity.categoria;
import com.jarod.fintrack.entity.usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface categoriaRepository extends JpaRepository<categoria, UUID> {
    List<categoria> findByUsuario(usuario usuario);
    Optional<categoria> findByUsuarioAndNombreIgnoreCase(usuario usuario, String nombre);
}