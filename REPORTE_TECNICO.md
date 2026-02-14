# Reporte Técnico — CASLA V7.0 (Core Legacy Edition)

> Fecha de cierre: 13 de Febrero de 2026  
> Estado: ✅ **PRODUCCIÓN ACTIVA** — Base de datos Neon PostgreSQL conectada y verificada.

---

## 1. Resumen Ejecutivo

El proyecto CASLA ha alcanzado la versión **V7.0**, robusteciendo la arquitectura de datos con módulos de CRM, Gestión Documental y Perfil Extendido (Legacy).

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

---

## 6. Monitoreo y Métricas en Producción

Para evaluar la salud y el uso de la aplicación, contamos con tres paneles clave:

### 6.1 Vercel Analytics (Frontend & API)
- **Speed Insights**: Mide la velocidad real experimentada por los usuarios (Core Web Vitals).
- **Web Analytics**: Tráfico, visitantes únicos y rutas más visitadas.
- **Function Logs**: Tiempos de ejecución de las API Routes y errores de servidor (500).
- **Usage**: Muestra el consumo de ancho de banda y ejecuciones de Serverless Functions (límite plan Hobby).

### 6.2 Neon Dashboard (Base de Datos)
- **Compute Hours**: Tiempo que la base de datos está activa (se apaga automáticamente tras inactividad en plan Free).
- **Active Connections**: Número de usuarios simultáneos conectados a la DB.
- **Storage**: Espacio en disco utilizado por las tablas y backups.
- **Slow Query Log**: Identifica consultas lentas que necesitan optimización (Índices).

### 6.3 Monitoreo Local (Lighthouse)
- Ejecutable desde Chrome DevTools en modo "Incógnito".
- Evalúa Performance, Accesibilidad y SEO on-page.
- Meta: Mantener puntuaciones arriba de 90 en Desktop y Mobile.
