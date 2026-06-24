package com.jarod.fintrack.repository;

import com.jarod.fintrack.entity.categoria;
import com.jarod.fintrack.entity.presupuesto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface presupuestoRepository extends JpaRepository<presupuesto, UUID> {

    @Query("SELECT p FROM presupuesto p WHERE p.categoria.usuario.email = :email")
    List<presupuesto> findByUsuarioEmail(@Param("email") String email);

    Optional<presupuesto> findByCategoria(categoria categoria);
}