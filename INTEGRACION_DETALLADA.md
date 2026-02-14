# Reporte de Integración Integral: Proyecto CASLA V6.0

Este documento detalla la arquitectura técnica, el flujo de datos y la integración entre el Frontend, Backend (API) y la Base de Datos (Neon PostgreSQL).

## 1. Arquitectura de Datos y Esquema

### 1.1 Modelos Críticos (Prisma)
El sistema utiliza **Prisma ORM** con una base de datos **Neon PostgreSQL**. Los modelos principales son:

- **Member**: Corazón del sistema de socios.
  - Campos clave: `dni`, `password`, `fullName`, `memberNumber`, `category`, `status`, `qrToken`, `qrExpiresAt`.
- **User**: Para personal administrativo/staff.
- **Event**: Gestión de partidos y actividades.
- **Payment / Ticket**: Registro de transacciones y acceso al estadio.

### 1.2 Mapeo de Campos (DB vs UI)

| Entidad | Campo DB (Prisma) | Propiedad UI (React) | Notas |
| :--- | :--- | :--- | :--- |
| Socio | `fullName` | `nombre` / `fullName` | El frontend soporta ambos para compatibilidad. |
| Socio | `memberNumber` | `numero` / `memberNumber` | Identificador visual del carnet. |
| Socio | `dni` | `dni` | Usado como nombre de usuario en login. |
| Evento | `sectors` | `sectors` | Almacenado como JSON String en DB, parseado en API. |

---

## 2. Flujos Críticos de Usuario (Análisis de Código)

### 2.1 Login de Socio
El flujo de autenticación está centralizado en `src/lib/auth.js` usando **NextAuth.js**.

1. **Input**: DNI y Contraseña.
2. **Proceso**:
   ```javascript
   const member = await prisma.member.findUnique({ where: { dni: username } });
   // Validación: Si no tiene pass, usa 'casla' por defecto (migración legacy)
   const isValidPass = member.password ? (member.password === password) : (password === "casla");
   ```
3. **Resultado**: Se genera un token JWT con `memberId` y `userType: 'socio'`.

### 2.2 Generación de ID Digital (QR Dinámico)
Implementado en `src/app/api/member/qr/route.js`.

1. El sistema verifica si el socio tiene un `qrToken` válido (no expirado).
2. Si no existe o expiró:
   - Se genera un hash de 32 bytes (`crypto.randomBytes(32)`).
   - Se guarda en la DB con expiración de +5 minutos.
3. El frontend (`DigitalID.jsx`) consume este token y genera el QR usando `qrserver.com`.

---

## 3. Endpoints de la API y Consumo

### 3.1 Lista de Endpoints Principales
- `GET /api/member`: Recupera el perfil del socio actual. Utiliza el `id` de la sesión.
- `GET /api/members`: (Admin) Lista completa de socios para el dashboard.
- `GET /api/events?category=X`: Filtra eventos por categoría (FUTBOL, POLIDEPORTIVO, etc.).
- `GET /api/payments?memberId=X`: Historial financiero paginado.
- `PATCH /api/notifications`: Marca notificaciones como leídas.

### 3.2 Estrategia de Fallback (Mock Data)
Para garantizar la resiliencia en entornos de desarrollo sin DB activa, todos los endpoints implementan un fallback a `@/lib/mockDb.json`.

---

## 4. Estructura de Proyecto y Archivos Exportados

### 4.1 Archivos de Configuración
- `prisma/schema.prisma`: Definición de la estructura de tablas.
- `src/lib/db.js`: Cliente dinámico (PostgreSQL Adapter para Neon / SQLite para Local).
- `src/lib/auth.js`: Configuración de proveedores y callbacks de NextAuth.
- `.env`: Variables de entorno para conexión SSL y secretos de sesión.

### 4.2 Componentes Frontend de Datos
- `src/components/socio/HomeTab.jsx`: Consumo de eventos y notificaciones.
- `src/components/socio/CarnetQRTab.jsx`: Gestión de identidad digital.
- `src/components/sections/DashboardSection.jsx`: Interfaz administrativa de búsqueda masiva.

---

## 5. Hallazgos e Inconsistencias Detectadas

> [!IMPORTANT]
> **Diferencia de Nomenclatura**: En `MemberProfileSection.jsx` y `DashboardSection.jsx`, se detectó el uso de `searchResult.nombre` y `searchResult.fullName`. Se recomienda estandarizar a `fullName` en futuras refactorizaciones.

> [!WARNING]
> **Seguridad**: El portal administrativo usa credenciales hardcoded (`admin@casla.com.ar`). Se recomienda migrar estos usuarios a la tabla `User` de Prisma para mayor control.

> [!TIP]
> **Performance**: Los campos `sectors` y `payPlans` en la tabla `Event` son Strings. El backend realiza un `JSON.parse` en cada petición. Para gran volumen, esto debería ser un tipo `Json` nativo de PostgreSQL.
