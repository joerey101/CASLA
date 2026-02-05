---
description: Información de despliegue y configuración del proyecto CASLA
---

Este proyecto está configurado para trabajar con **Vercel** y un repositorio en **GitHub**.

### Configuración del Entorno
1. **GitHub**: El código se sincroniza con el repositorio de GitHub para disparar los despliegues.
2. **Vercel**: La instancia online está vinculada directamente al repositorio para CI/CD automático.
3. **Comandos de Despliegue**: 
   - Para subir cambios: `git add .`, `git commit -m "update"`, `git push origin main`.
   - Vercel detecta el push y actualiza la URL de producción.

### Tecnologías Clave
- Next.js (App Router)
- Lucide React para iconos
- Tailwind CSS / CSS Vanilla
- Mock Database para el Portal ADM

// turbo
### Actualizar Instancia Online
1. git add .
2. git commit -m "Actualización Portal ADM"
3. git push origin main
