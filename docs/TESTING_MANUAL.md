# Pruebas manuales de la entrega final

Base URL:

```text
http://localhost:8080
```

## Preparación obligatoria

```bash
npm ci
npm run verify
npm start
```

`npm run verify` debe terminar con código 0 antes de probar Atlas.

## 1. Salud

```http
GET /health
```

Esperado: `200`.

## 2. Crear servicio

```http
POST /api/services
Content-Type: application/json
```

```json
{
  "name": "Servicio prueba final",
  "description": "Servicio creado para validar la entrega final.",
  "category": "Salud",
  "price": 15000,
  "duration": 45,
  "available": true
}
```

Esperado: `201`. Guardar `payload._id` como `serviceId`.

## 3. Consultas avanzadas

Probar:

```http
GET /api/services?page=1&limit=5&available=true&minPrice=1000&maxPrice=50000&sort=asc
```

Esperado: `200`, `payload` y metadatos de paginación.

### Categoría case-insensitive

Aunque el servicio fue creado con `"category": "Salud"`:

```http
GET /api/services?category=salud
```

debe encontrarlo.

También deben funcionar `SALUD` y `Salud`.

## 4. CRUD de servicios

```http
GET /api/services/{serviceId}
PATCH /api/services/{serviceId}
DELETE /api/services/{serviceId}
```

No eliminar el servicio hasta finalizar las pruebas de reservas.

## 5. Crear reserva

```http
POST /api/bookings
Content-Type: application/json
```

```json
{
  "customerName": "Cliente de prueba",
  "customerEmail": "cliente@example.com",
  "scheduledAt": "2026-08-25T15:00:00.000Z",
  "notes": "Reserva para prueba manual",
  "services": []
}
```

Esperado: `201`. Guardar `payload._id` como `bookingId`.

## 6. Agregar servicio por primera vez

```http
POST /api/bookings/{bookingId}/services/{serviceId}
Content-Type: application/json
```

```json
{
  "quantity": 2
}
```

Esperado:

```text
200
quantity = 2
una sola referencia al serviceId
```

## 7. Repetir el mismo servicio

Ejecutar nuevamente:

```http
POST /api/bookings/{bookingId}/services/{serviceId}
```

```json
{
  "quantity": 1
}
```

Esperado:

```text
200
quantity = 3
services contiene una sola entrada para serviceId
```

No debe responder `409` ni duplicar el servicio.

## 8. GET principal con populate

```http
GET /api/bookings/{bookingId}
```

Esperado: `200`.

`services[0].service` debe ser un objeto con al menos:

```text
_id
name
description
category
price
duration
available
```

Esto demuestra `ObjectId + ref + populate`.

La ruta:

```http
GET /api/bookings/{bookingId}/populated
```

también debe seguir funcionando como alias.

## 9. Actualizar cantidad directamente

```http
PUT /api/bookings/{bookingId}/services/{serviceId}
```

```json
{
  "quantity": 5
}
```

Esperado: `200`, `quantity = 5`.

## 10. Validaciones Zod

### Body incompleto

```http
POST /api/services
```

```json
{
  "name": "A"
}
```

Esperado: `400`.

### ObjectId inválido

```http
GET /api/services/abc
```

Esperado: `400`.

### Servicio inexistente

Usar un ObjectId válido inexistente:

```http
GET /api/services/000000000000000000000000
```

Esperado: `404`.

## 11. Handlebars

Abrir:

```text
http://localhost:8080/services
http://localhost:8080/realtime-services
http://localhost:8080/bookings/{bookingId}
```

Todas deben renderizar sin error.

## 12. Socket.io

1. Abrir `/realtime-services` en dos ventanas.
2. Crear un servicio con Postman/Thunder Client.
3. Debe aparecer sin F5.
4. Modificar disponibilidad.
5. Debe cambiar sin F5.
6. Eliminar el servicio.
7. Debe desaparecer sin F5.

## 13. Limpieza

Quitar servicio, eliminar reserva y finalmente eliminar el servicio utilizado para las pruebas.

## Resultado final

La entrega sólo está lista cuando:

```text
npm run verify → OK
MongoDB Atlas → OK
CRUD → OK
ObjectId → OK
populate → OK
filters/page/sort → OK
Zod → OK
Handlebars → OK
Socket.io → OK
```
