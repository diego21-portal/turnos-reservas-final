# Checklist final antes de entregar

## 1. Instalación

- [ ] `npm install` termina correctamente.
- [ ] Existe `package-lock.json` y está versionado.
- [ ] `npm run check` termina con código 0.
- [ ] `npm start` conecta con MongoDB Atlas.
- [ ] `GET /health` responde 200.

## 2. Seguridad del repositorio

- [ ] `.env` NO aparece en GitHub.
- [ ] `node_modules/` NO aparece en GitHub.
- [ ] No hay usuario/password de Atlas pegado en README, JS, JSON ni capturas públicas.
- [ ] `.env.example` sí está en GitHub y no contiene credenciales reales.

Comandos útiles:

```bash
git status
git ls-files .env
git ls-files node_modules
```

Los dos últimos comandos deben devolver vacío.

## 3. Servicios

- [ ] POST `/api/services`.
- [ ] GET `/api/services`.
- [ ] GET `/api/services/:serviceId`.
- [ ] PATCH `/api/services/:serviceId`.
- [ ] DELETE `/api/services/:serviceId`.
- [ ] Filtros por categoría/disponibilidad/precio.
- [ ] Paginación.
- [ ] Ordenamiento por precio.
- [ ] Error por body inválido.
- [ ] Error por servicio inexistente.

## 4. Reservas

- [ ] POST `/api/bookings`.
- [ ] GET `/api/bookings/:bookingId`.
- [ ] GET `/api/bookings/:bookingId/populated`.
- [ ] POST servicio a reserva.
- [ ] PUT/PATCH cantidad.
- [ ] DELETE servicio de reserva.
- [ ] DELETE para vaciar servicios.
- [ ] DELETE reserva.
- [ ] Error al asociar servicio inexistente.
- [ ] Error al consultar reserva inexistente.

## 5. MongoDB

- [ ] En Booking, `services.service` es ObjectId.
- [ ] Booking no guarda el objeto Service completo.
- [ ] `populate()` devuelve nombre/precio/etc. al consultar la ruta populated.

## 6. Vistas

- [ ] `/services` abre sin error.
- [ ] `/realtime-services` abre sin error.
- [ ] `/bookings/:bookingId` abre con una reserva válida.
- [ ] La información es legible.

## 7. Socket.io

- [ ] Abrir `/realtime-services`.
- [ ] Crear un servicio con Postman.
- [ ] La tabla cambia sin F5.
- [ ] Actualizar disponibilidad.
- [ ] La vista refleja el cambio sin F5.
- [ ] Eliminar un servicio.
- [ ] La fila desaparece sin F5.

## 8. Git/GitHub

- [ ] `git status` está limpio antes de entregar.
- [ ] Todos los cambios tienen commit.
- [ ] Se hizo `git push` a la rama correcta.
- [ ] El repositorio es público o accesible para Ticher.
- [ ] El README se ve correctamente desde GitHub.
- [ ] El enlace entregado abre directamente el repositorio.

## 9. Última revisión

- [ ] Importar y ejecutar la colección Postman.
- [ ] Revisar consola del servidor: sin errores inesperados.
- [ ] Revisar navegador: sin errores funcionales.
- [ ] No entregar hasta que todos los puntos anteriores estén verificados.
