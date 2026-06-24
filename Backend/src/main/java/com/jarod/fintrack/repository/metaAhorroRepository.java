package com.jarod.fintrack.repository;

import com.jarod.fintrack.entity.metaAhorro;
import com.jarod.fintrack.entity.usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface metaAhorroRepository extends JpaRepository<metaAhorro, UUID> {
    List<metaAhorro> findByUsuario(usuario usuario);
}