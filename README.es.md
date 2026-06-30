<div align="center">
  <img src="docs/screenshots/icon.png" alt="FinTrack Logo" width="120"/>

  # FinTrack v2

  **Gestor de finanzas personales — web y Android**

  [![Demo en vivo](https://img.shields.io/badge/Demo%20en%20vivo-Vercel-black?style=for-the-badge&logo=vercel)](https://fintrack-v2-lake.vercel.app)
  [![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://render.com)
  [![Licencia](https://img.shields.io/badge/Licencia-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

> 🇺🇸 [English version](README.md)

---

## 📌 Descripción

FinTrack v2 es una aplicación web full-stack de finanzas personales que permite registrar ingresos y gastos, gestionar metas de ahorro, controlar presupuestos por cuenta y moneda, y monitorear el balance financiero general en tiempo real.

La app está desplegada en producción y también empaquetada como APK Android mediante Capacitor.

---

## 📸 Capturas de pantalla

<div align="center">

| Login | Dashboard | Metas de Ahorro |
|-------|-----------|-----------------|
| <img src="docs/screenshots/login-mobile.png" width="200"/> | <img src="docs/screenshots/dashboard-mobile.png" width="200"/> | <img src="docs/screenshots/metas-desktop.png" width="380"/> |

</div>

---

## 🚀 Funcionalidades

- 🔐 Autenticación stateless con JWT + Spring Security
- 💰 Registro de ingresos y gastos por cuenta y moneda
- 🎯 Metas de ahorro con seguimiento de progreso
- 📊 Gestión de presupuestos por cuenta
- 🔄 Actualización automática de balances en cada transacción
- 📱 APK Android empaquetada con Capacitor
- ☁️ Desplegada en producción (Render + Vercel)
- ⚙️ CI/CD automatizado con GitHub Actions

---

## 🛠️ Stack tecnológico

### Backend
| Tecnología | Uso |
|---|---|
| Java + Spring Boot 4.1 | API REST |
| Spring Security + JWT | Autenticación y autorización |
| PostgreSQL | Base de datos relacional |
| JPA / Hibernate | ORM |
| Docker | Contenerización |

### Frontend
| Tecnología | Uso |
|---|---|
| React + Vite | Framework SPA |
| Tailwind CSS | Estilos |
| Axios | Cliente HTTP |
| Capacitor | Empaquetado APK Android |

### DevOps
| Tecnología | Uso |
|---|---|
| GitHub Actions | Pipeline CI/CD |
| Render | Hosting del backend |
| Vercel | Hosting del frontend |

---

## 📁 Estructura del proyecto

```
fintrack-v2/
├── Backend/          # API REST con Spring Boot
│   └── src/
├── frontend/         # SPA con React + Vite
│   └── src/
└── docker-compose.yml
```

---

## ⚙️ Configuración local

### Requisitos previos
- Java 21+
- Node.js 18+
- PostgreSQL
- Docker (opcional)

### Backend

```bash
cd Backend
# Configurar .env o application.properties con credenciales de BD
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Con Docker

```bash
docker-compose up --build
```

---

## 🌐 Despliegue

| Servicio | URL |
|---|---|
| Frontend (Vercel) | https://fintrack-v2-lake.vercel.app |
| Backend (Render) | Render free tier — puede haber cold start en la primera solicitud |

> **Nota:** El backend está en el plan gratuito de Render. Si la primera solicitud tarda unos segundos, es el servidor despertando desde inactivo.

### 🔑 Cuenta de prueba

| Campo | Valor |
|---|---|
| Email | prueba@fintrack.com |
| Contraseña | fintrack123 |

> El servidor puede tardar hasta un minuto en despertar en la primera carga (hosting gratuito).

---

## 👨‍💻 Autor

**Jarod Bonilla Granados**
Estudiante de Ingeniería de Sistemas — Universidad Nacional de Costa Rica (UNA)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-jarod--bonilla--granados-0077B5?style=flat&logo=linkedin)](https://linkedin.com/in/jarod-bonilla-granados-70b94b254)
[![GitHub](https://img.shields.io/badge/GitHub-JarodBonillaG-181717?style=flat&logo=github)](https://github.com/JarodBonillaG)
