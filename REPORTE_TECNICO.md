# Reporte Técnico — CASLA V6.0

> Fecha de cierre: 13 de Febrero de 2026  
> Estado: ✅ **PRODUCCIÓN ACTIVA** — Base de datos Neon PostgreSQL conectada y verificada.

---

## 1. Resumen Ejecutivo

El proyecto CASLA ha alcanzado la versión **V6.0**, consolidando la migración completa a una arquitectura de producción con base de datos centralizada en la nube.

### Logros principales de V6.0:
- ✅ **Base de datos Neon PostgreSQL** operativa en producción (Vercel) y desarrollo.
- ✅ **Autenticación funcional** para socios (DNI + Contraseña via DB) y administradores.
- ✅ **ID Digital con QR Dinámico** rotativo cada 5 minutos.
- ✅ **Deploy automatizado** via GitHub → Vercel con Prisma v7.
- ✅ **Portal de socios** accesible con datos reales de la base de datos.

---

## 2. Stack Tecnológico

| Componente | Tecnología | Versión |
| :--- | :--- | :--- |
| Framework | Next.js | 16.1.6 |
| ORM | Prisma | 7.3.0 |
| Base de Datos | Neon PostgreSQL | Cloud (sa-east-1) |
| Auth | NextAuth.js | 4.24.13 |
| Hosting | Vercel | Producción |
| Repositorio | GitHub | `joerey101/CASLA` (main) |

---

## 3. Configuración de Producción

### Variables de Entorno (Vercel)
- `DATABASE_URL` → Neon pooled connection (para la app)
- `POSTGRES_URL_NON_POOLING` → Neon direct connection (para migraciones)
- `NEXTAUTH_SECRET` → Secret para JWT
- `NEXTAUTH_URL` → URL base del sitio

### Prisma v7
- `prisma.config.ts` → Configuración centralizada con `datasource.url` dinámico.
- `schema.prisma` → Solo define `provider = "postgresql"`, sin URLs hardcodeadas.

---

## 4. Credenciales de Prueba

| Rol | Usuario | Contraseña |
| :--- | :--- | :--- |
| Socio | `33000000` | `socio123` |
| Admin | `admin@casla.com.ar` | `admin123` |

---

## 5. Historial de Cambios (V5.1 → V6.0)

1. Migración de base de datos bi-modal (SQLite/Postgres) a Neon centralizada.
2. Corrección de errores de linting y performance (SplashScreen, MasTab).
3. Configuración de Prisma v7 (`prisma.config.ts` con env vars dinámicas).
4. Eliminación de URLs hardcodeadas en configuración de Prisma.
5. Seed de datos de producción (socio de prueba + eventos).
6. Deploy exitoso en Vercel con base de datos viva.
7. Documentación técnica completa (`INTEGRACION_DETALLADA.md`).
