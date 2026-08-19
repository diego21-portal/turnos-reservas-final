# Arquitectura del proyecto

## Flujo principal

```text
Cliente HTTP / navegador
        ↓
      Route
        ↓
 Validación Zod
        ↓
    Controller
        ↓
     Service
        ↓
   Repository
        ↓
       DAO
        ↓
 Mongoose Model
        ↓
 MongoDB Atlas
```

## Responsabilidades

### Routes

Definen endpoints, validaciones y conexión con controllers. No consultan MongoDB ni contienen reglas de negocio.

### Controllers

Son la frontera HTTP. Leen `req`, llaman a services y construyen la respuesta con `res`. No importan repositories, DAO, models ni Mongoose.

### Services

Contienen las reglas de negocio. Entre ellas:

- existencia de recursos;
- validación referencial entre reservas y servicios;
- incremento de `quantity` cuando el mismo servicio vuelve a agregarse;
- integridad referencial al eliminar servicios;
- construcción de filtros, paginación y ordenamiento.

No utilizan `req`, `res`, Mongoose ni archivos de persistencia.

### Repositories

Ofrecen a los services una interfaz de persistencia y delegan en los DAO. No contienen reglas de negocio.

### DAO

Son la única capa que accede directamente a los modelos Mongoose y ejecuta consultas como `find`, `findByIdAndUpdate`, `populate`, `$push`, `$pull` y `$set`.

### Models

Definen la estructura persistida en MongoDB.

## Relación Booking → Service

La reserva almacena:

```js
services: [
  {
    service: ObjectId,
    quantity: Number
  }
]
```

`service` usa:

```js
ref: "Service"
```

El objeto completo de Service no se guarda dentro de Booking.

## Regla de quantity

Cuando un servicio no está asociado a la reserva:

```text
POST servicio
→ { service: ObjectId, quantity: cantidad }
```

Cuando ya existe:

```text
quantityActual + quantityRecibida
→ se actualiza el único elemento existente
```

La regla se calcula en `src/services/booking.service.js`. El DAO únicamente persiste el valor final.

## Populate

`src/dao/booking.dao.js` define:

```text
services.service
```

como path de `populate`.

El endpoint principal:

```http
GET /api/bookings/:bookingId
```

devuelve la reserva con datos completos de los servicios. La ruta histórica `/populated` se conserva como alias.

## Consultas avanzadas

`GET /api/services` acepta:

- `page`
- `limit`
- `category`
- `available`
- `minPrice`
- `maxPrice`
- `sort`
- `search`

La categoría es exacta pero case-insensitive.

## Tiempo real

1. El navegador abre `/realtime-services`.
2. Socket.io establece la conexión.
3. POST, PUT/PATCH o DELETE modifica un servicio.
4. El controller emite `services:changed`.
5. El navegador recibe el evento.
6. El cliente vuelve a consultar `/api/services`.
7. La tabla se actualiza sin F5.
