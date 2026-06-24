package com.jarod.fintrack.repository;

import com.jarod.fintrack.entity.cuenta;
import com.jarod.fintrack.entity.usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface cuentaRepository extends JpaRepository<cuenta, UUID> {
    List<cuenta> findByUsuario(usuario usuario);
}