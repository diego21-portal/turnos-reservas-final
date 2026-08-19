# Checklist final antes de entregar

## 1. Instalación y automatización

- [ ] `npm ci` termina correctamente.
- [ ] `package-lock.json` está versionado.
- [ ] `npm run check` termina con código 0.
- [ ] `npm test` termina con 0 fallos.
- [ ] `npm run verify` termina con código 0.
- [ ] GitHub Actions muestra CI en verde.

## 2. Seguridad

- [ ] `.env` NO aparece en GitHub.
- [ ] `node_modules/` NO aparece en GitHub.
- [ ] No hay usuario/password real de Atlas en código, README, JSON ni capturas.
- [ ] `.env.example` sí está versionado y no contiene secretos.

Comprobar:

```bash
git status
git ls-files .env
git ls-files node_modules
```

Los dos últimos deben devolver vacío.

## 3. Arquitectura

- [ ] Existe `src/routes/`.
- [ ] Existe `src/controllers/`.
- [ ] Existe `src/services/`.
- [ ] Existe `src/repositories/`.
- [ ] Existe `src/dao/`.
- [ ] Existe `src/models/`.
- [ ] Controllers no importan DAO/models.
- [ ] Services no importan DAO/models/Mongoose.
- [ ] Repositories delegan en DAO.
- [ ] DAO es la capa que importa modelos Mongoose.
- [ ] `src/models/message.model.js` existe.

## 4. Services

- [ ] POST `/api/services`.
- [ ] GET `/api/services`.
- [ ] GET `/api/services/:serviceId`.
- [ ] PUT/PATCH `/api/services/:serviceId`.
- [ ] DELETE `/api/services/:serviceId`.
- [ ] Filtro `category=salud` encuentra `"Salud"`.
- [ ] Filtro `available`.
- [ ] Filtros de precio.
- [ ] `page` + `limit`.
- [ ] `sort=asc`.
- [ ] `sort=desc`.
- [ ] `search`.

## 5. Bookings / relaciones

- [ ] POST `/api/bookings`.
- [ ] GET `/api/bookings/:bookingId`.
- [ ] GET principal devuelve services populados.
- [ ] `services.service` es ObjectId con `ref: "Service"`.
- [ ] Booking no guarda Service completo.
- [ ] Primer POST de servicio crea una entrada.
- [ ] Segundo POST del mismo servicio incrementa `quantity`.
- [ ] No se duplica el servicio.
- [ ] PUT/PATCH actualiza quantity.
- [ ] DELETE quita servicio.
- [ ] DELETE vacía servicios.
- [ ] DELETE elimina reserva.

## 6. Zod

- [ ] Body inválido devuelve `400`.
- [ ] ObjectId inválido devuelve `400`.
- [ ] Query inválida devuelve `400`.
- [ ] La validación ocurre en middleware antes del controller.

## 7. Handlebars

- [ ] `/services` abre.
- [ ] `/realtime-services` abre.
- [ ] `/bookings/:bookingId` abre con una reserva válida.

## 8. Socket.io

- [ ] Abrir `/realtime-services` en dos ventanas.
- [ ] Crear servicio.
- [ ] Ambas ventanas cambian sin F5.
- [ ] Actualizar disponibilidad.
- [ ] Ambas reflejan el cambio sin F5.
- [ ] Eliminar servicio.
- [ ] Desaparece sin F5.

## 9. MongoDB Atlas

- [ ] `npm start` conecta correctamente.
- [ ] Network Access permite la IP actual.
- [ ] Database User tiene permisos correctos.
- [ ] `MONGO_URI` sólo está en `.env`.
- [ ] Los documentos aparecen en las colecciones de Atlas.

## 10. Git/GitHub

- [ ] Los cambios están divididos en commits claros.
- [ ] `git status` está limpio.
- [ ] `git push` se hizo a `main`.
- [ ] El repo es público.
- [ ] README abre correctamente.
- [ ] Actions está verde.
- [ ] El enlace público abre en incógnito.

## 11. Última prueba desde cero

En una carpeta distinta:

```bash
git clone https://github.com/diego21-portal/turnos-reservas-final.git
cd turnos-reservas-final
npm ci
npm run verify
```

Después crear `.env`, ejecutar:

```bash
npm start
```

y repetir las pruebas principales.

**No usar el último intento de Coderhouse hasta completar todos los puntos.**
