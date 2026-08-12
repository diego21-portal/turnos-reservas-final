# Pruebas manuales de la entrega final

Base URL por defecto:

```text
http://localhost:8080
```

Usar Postman o Thunder Client.

## Preparación

1. Ejecutar `npm install`.
2. Configurar `.env`.
3. Ejecutar `npm start`.
4. Confirmar `GET /health`.

Opcionalmente:

```bash
npm run seed
```

## 1. Crear servicio

`POST /api/services`

```json
{
  "name": "Servicio prueba final",
  "description": "Servicio creado para validar la entrega final.",
  "category": "Pruebas",
  "price": 15000,
  "duration": 45,
  "available": true
}
```

Esperado: `201`, guardar `payload._id` como `serviceId`.

## 2. Listar servicios con consultas avanzadas

```http
GET /api/services?page=1&limit=5&available=true&minPrice=1000&maxPrice=50000&sort=asc
```

Esperado: `200` y metadatos de paginación.

## 3. Consultar servicio por id

```http
GET /api/services/{serviceId}
```

Esperado: `200`.

## 4. Actualizar servicio

```http
PATCH /api/services/{serviceId}
```

```json
{
  "price": 16500,
  "available": false
}
```

Esperado: `200`.

## 5. Crear reserva

`POST /api/bookings`

```json
{
  "customerName": "Cliente de prueba",
  "customerEmail": "cliente@example.com",
  "scheduledAt": "2026-08-25T15:00:00.000Z",
  "notes": "Reserva para prueba manual",
  "services": []
}
```

Esperado: `201`, guardar `payload._id` como `bookingId`.

## 6. Consultar reserva

```http
GET /api/bookings/{bookingId}
```

Esperado: `200`.

## 7. Agregar servicio a reserva

```http
POST /api/bookings/{bookingId}/services/{serviceId}
```

```json
{
  "quantity": 2
}
```

Esperado: `200`. En la respuesta populated debe aparecer el servicio.

## 8. Actualizar cantidad

```http
PUT /api/bookings/{bookingId}/services/{serviceId}
```

```json
{
  "quantity": 3
}
```

Esperado: `200`, `quantity = 3`.

## 9. Consultar con populate

```http
GET /api/bookings/{bookingId}/populated
```

Esperado: `200` y `services[0].service` debe ser un objeto con los datos del servicio.

Comparar con:

```http
GET /api/bookings/{bookingId}
```

Aquí `services[0].service` debe ser sólo el ObjectId.

## 10. Vista de reserva

Abrir:

```text
http://localhost:8080/bookings/{bookingId}
```

Esperado: datos de cliente, servicio, cantidad, precio y total.

## 11. Quitar servicio de reserva

```http
DELETE /api/bookings/{bookingId}/services/{serviceId}
```

Esperado: `200` y array sin ese servicio.

## 12. Vaciar reserva

Volver a agregar el servicio y luego:

```http
DELETE /api/bookings/{bookingId}/services
```

Esperado: `200`, `services: []`.

## 13. Eliminar reserva

```http
DELETE /api/bookings/{bookingId}
```

Esperado: `200`.

## 14. Eliminar servicio

```http
DELETE /api/services/{serviceId}
```

Esperado: `200`.

## Casos de error obligatorios

### Servicio inexistente

Usar un ObjectId válido que no exista:

```http
GET /api/services/000000000000000000000000
```

Esperado: `404`.

### Servicio con datos incompletos

```http
POST /api/services
Content-Type: application/json
```

```json
{
  "name": "A"
}
```

Esperado: `400`, error de Zod.

### ObjectId inválido

```http
GET /api/services/abc
```

Esperado: `400`.

### Servicio inexistente en reserva

```http
POST /api/bookings/{bookingId}/services/000000000000000000000000
```

```json
{
  "quantity": 1
}
```

Esperado: `404`.

### Reserva inexistente

```http
GET /api/bookings/000000000000000000000000
```

Esperado: `404`.

### Servicio duplicado dentro de la misma reserva

Agregar dos veces el mismo `serviceId`.

Esperado en el segundo intento: `409`.

## Socket.io

1. Abrir `http://localhost:8080/realtime-services`.
2. Mantener esa pestaña abierta.
3. Crear un servicio con Postman.
4. Verificar que aparece sin F5.
5. Actualizar `available`.
6. Verificar cambio sin F5.
7. Eliminarlo.
8. Verificar desaparición sin F5.

## Resultado final

La entrega está lista únicamente cuando todos los casos exitosos y de error anteriores producen los códigos esperados y las vistas funcionan sin errores visibles.
