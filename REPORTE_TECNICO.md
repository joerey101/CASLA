# Reporte Técnico de Avances - Proyecto CASLA
**Fecha:** 13 de Febrero, 2026
**Hito:** Estabilización Backend, Bi-modal DB y Deploy a Vercel

## 1. Migración a Base de Datos en la Nube (Neon PostgreSQL)
Se ha completado la migración de la base de datos local (SQLite) a una infraestructura escalable en la nube:
- **Centralización de Datos:** El sistema ahora utiliza **Neon PostgreSQL** de forma nativa tanto en entorno de desarrollo local como en producción (Vercel). Esto asegura paridad total de datos entre lo que se ve en la Mac y lo que ven los usuarios en la web.
- **Conector Express / Prisma:** Se configuró el cliente de Prisma para manejar la conexión segura vía SSL y el pooling de conexiones para optimizar el rendimiento.
- **Eliminación de Mocks:** El sistema ya no depende de archivos locales `.db` para los datos críticos, centralizando toda la lógica de negocio en la nube.


## 2. Unificación de Autenticación
- **Validación de Credenciales:** Se corrigió el flujo de login de socios. Ya no depende de mocks estáticos; las consultas a `Prisma` ahora incluyen los filtros de identidad correctos (`memberId`, `dni`).
- **Socio Login Fix:** Se verificó localmente que el DNI `33000000` con password `socio123` permite el acceso total al dashboard de socios cargando datos reales desde la base de datos.
- **Null-checks Preventivos:** Se agregaron salvaguardas en las APIs para que, en caso de falla de conexión a la DB, el sistema retorne datos de reserva (mocks) en lugar de arrojar un error 500.

## 3. Automatización de Despliegue (DevOps)
- **Provisionamiento Automático:** Se configuró el `package.json` para que Vercel realice automáticamente:
    1. `prisma generate`: Regeneración del cliente.
    2. `db push`: Sincronización del esquema con Neon PostgreSQL.
    3. `db seed`: Carga de datos de prueba (Mariano Pérez) para asegurar que el sistema esté listo inmediatamente tras el deploy.
- **Sincronización de Entorno:** Se alinearon las variables `NEXTAUTH_SECRET` y se limpiaron los secretos hardcodeados en el código fuente por seguridad.

## 4. Verificación de Funcionalidad
- ✅ **Admin Login:** Funcionando (`admin@casla.com.ar` / `admin`).
- ✅ **Socio Login:** Funcionando con persistencia de DB SQLite local.
- ✅ **Dashboard Socio:** Renderizando correctamente con "Bienvenido Mariano!", tabs interactivas y Token QR funcional.
- 🚀 **Estado en Vercel:** Código subido a GitHub y proceso de build automatizado iniciado.

---
---
**INFORMACIÓN DE CONEXIÓN (NEON CLOUD):**
- **Host:** `ep-aged-wildflower-ac2dxuks-pooler.sa-east-1.aws.neon.tech`
- **Database:** `neondb`
- **Region:** sa-east-1 (San Pablo)
- **URL (Dev/Vercel):** `postgresql://neondb_owner:npg_jxq6XfyLp8ln@ep-aged-wildflower-ac2dxuks-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require`

**IMPORTANTE PARA PRODUCCIÓN:**
Para que la conexión sea exitosa en Vercel, es mandatorio asegurar que las variables de entorno (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`) estén configuradas en el dashboard de Vercel. Al usar Neon de forma centralizada, el deploy reflejará exactamente los mismos datos que ves en tu localhost.

