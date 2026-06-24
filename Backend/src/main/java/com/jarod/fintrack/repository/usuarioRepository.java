package com.jarod.fintrack.repository;

import com.jarod.fintrack.entity.usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface usuarioRepository extends JpaRepository<usuario, UUID> {
    Optional<usuario> findByEmail(String email);
    boolean existsByEmail(String email);
}