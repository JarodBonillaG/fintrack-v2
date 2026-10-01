-- PostgreSQL: esquema basado en las seis entidades JPA de FinTrack.
-- Ejecutar conectado a una base vacia existente (por ejemplo, la de Render).
-- Los UUID y valores iniciales los proporciona la aplicacion.
BEGIN;

CREATE TABLE usuarios (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP(6) WITH TIME ZONE NOT NULL
);

CREATE TABLE cuentas (
    id UUID PRIMARY KEY,
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(255) NOT NULL CHECK (tipo IN ('EFECTIVO', 'BANCO', 'TARJETA_CREDITO', 'AHORRO')),
    moneda VARCHAR(255) NOT NULL CHECK (moneda IN ('CRC', 'USD')),
    balance NUMERIC(19,4) NOT NULL
);

CREATE TABLE categorias (
    id UUID PRIMARY KEY,
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(255) NOT NULL CHECK (tipo IN ('INGRESO', 'GASTO')),
    icono VARCHAR(255)
);

CREATE TABLE metas_ahorro (
    id UUID PRIMARY KEY,
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    nombre VARCHAR(255) NOT NULL,
    monto_objetivo NUMERIC(19,4) NOT NULL,
    monto_actual NUMERIC(19,4) NOT NULL,
    fecha_limite DATE
);

CREATE TABLE presupuestos (
    id UUID PRIMARY KEY,
    categoria_id UUID NOT NULL UNIQUE REFERENCES categorias(id),
    monto_limite NUMERIC(19,4) NOT NULL,
    periodo VARCHAR(255) NOT NULL CHECK (periodo IN ('SEMANAL', 'MENSUAL', 'ANUAL'))
);

CREATE TABLE transacciones (
    id UUID PRIMARY KEY,
    cuenta_id UUID NOT NULL REFERENCES cuentas(id),
    categoria_id UUID NOT NULL REFERENCES categorias(id),
    monto NUMERIC(19,4) NOT NULL,
    tipo VARCHAR(255) NOT NULL CHECK (tipo IN ('INGRESO', 'GASTO')),
    fecha DATE NOT NULL,
    descripcion VARCHAR(255),
    es_recurrente BOOLEAN NOT NULL,
    frecuencia VARCHAR(255) CHECK (frecuencia IN ('DIARIA', 'SEMANAL', 'MENSUAL', 'ANUAL'))
);

COMMIT;
