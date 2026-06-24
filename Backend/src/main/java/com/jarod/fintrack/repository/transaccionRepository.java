package com.jarod.fintrack.repository;

import com.jarod.fintrack.entity.transaccion;
import com.jarod.fintrack.entity.usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface transaccionRepository extends JpaRepository<transaccion, UUID> {

    @Query("""
    SELECT t FROM transaccion t
    WHERE t.cuenta.usuario = :usuario
    AND (:cuentaId IS NULL OR t.cuenta.id = :cuentaId)
    AND (:categoriaId IS NULL OR t.categoria.id = :categoriaId)
    AND (CAST(:desde AS date) IS NULL OR t.fecha >= :desde)
    AND (CAST(:hasta AS date) IS NULL OR t.fecha <= :hasta)
""")
    List<transaccion> findByUsuarioWithFilters(
            @Param("usuario") usuario usuario,
            @Param("cuentaId") UUID cuentaId,
            @Param("categoriaId") UUID categoriaId,
            @Param("desde") LocalDate desde,
            @Param("hasta") LocalDate hasta
    );
}