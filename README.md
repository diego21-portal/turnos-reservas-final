# Sistema Backend de Turnos y Reservas

Entrega final de Backend desarrollada con Node.js, Express, MongoDB Atlas, Mongoose, Zod, Handlebars y Socket.io.

El proyecto implementa una API REST completa para administrar servicios y reservas, con relaciones mediante `ObjectId`, consultas avanzadas, validaciones antes de la persistencia, vistas y actualización en tiempo real.

## Cumplimiento explícito de la rúbrica

| Criterio | Evidencia |
|---|---|
| Routes | `src/routes/` |
| Controllers | `src/controllers/` |
| Services | `src/services/` |
| Repositories | `src/repositories/` |
| DAO | `src/dao/` |
| Models Mongoose | `src/models/` |
| MongoDB Atlas | `src/config/db.config.js` |
| Variables de entorno | `src/config/env.config.js`, `.env.example` |
| CRUD de servicios | `src/routes/service.router.js` |
| ObjectId + ref | `src/models/booking.model.js` |
| `populate()` | `src/dao/booking.dao.js` |
| Incremento de `quantity` | `src/services/booking.service.js` |
| Filtros | `src/services/service.service.js` |
| Paginación | `service.service.js` + `service.dao.js` |
| Ordenamiento | `service.service.js` + `service.dao.js` |
| Zod | `src/schemas/` |
| Middleware de validación | `src/middlewares/validate.middleware.js` |
| Handlebars | `src/views/` |
| Socket.io | `src/sockets/` y `service.controller.js` |
| Vista tiempo real | `/realtime-services` |
| Pruebas automatizadas | `test/` + `npm test` |
| CI | `.github/workflows/ci.yml` |
| Verificación completa | `npm run verify` |

## Arquitectura

```text
Request / Browser
       ↓
     Route
       ↓
     Zod
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

Cada capa tiene una única responsabilidad:

- **Routes:** URLs, métodos HTTP y middlewares.
- **Controllers:** leen `req`, llaman al service y construyen `res`.
- **Services:** reglas de negocio.
- **Repositories:** interfaz de acceso a persistencia.
- **DAO:** consultas Mongoose.
- **Models:** schemas y relaciones MongoDB.
- **Schemas:** validación Zod.
- **Views:** Handlebars.
- **Sockets:** Socket.io.

Más detalle: `docs/ARCHITECTURE.md`.

## Requisitos

- Node.js 20 o superior.
- npm.
- MongoDB Atlas.
- Un Database User de Atlas.
- IP autorizada en Network Access.

## Instalación

```bash
git clone https://github.com/diego21-portal/turnos-reservas-final.git
cd turnos-reservas-final
npm ci
```

## Variables de entorno

Copiar:

```powershell
Copy-Item .env.example .env
```

Configurar localmente:

```env
PORT=8080
APP_NAME=Sistema Backend de Turnos y Reservas
APP_ENV=development
MONGO_URI=mongodb+srv://USUARIO:PASSWORD@CLUSTER.mongodb.net/turnos_reservas?retryWrites=true&w=majority
```

`.env` nunca debe subirse.

## Verificación automática

Antes de iniciar:

```bash
npm run verify
```

Este comando ejecuta:

```text
npm run check
npm test
```

Por separado:

```bash
npm run check
npm test
npm run test:architecture
```

Las pruebas cubren:

- regla de incremento de `quantity`;
- no duplicación del mismo servicio;
- límite de cantidad;
- filtro case-insensitive;
- filtros/paginación/ordenamiento;
- validaciones Zod;
- endpoint principal de bookings con populate;
- arquitectura por capas;
- ObjectId y `ref: "Service"`;
- existencia de `MessageModel`;
- `populate()` en DAO.

## Ejecución

```bash
npm start
```

Modo desarrollo:

```bash
npm run dev
```

Seed opcional:

```bash
npm run seed
```

Servidor:

```text
http://localhost:8080
```

Salud:

```http
GET /health
```

## CRUD de servicios

| Método | Endpoint | Uso |
|---|---|---|
| POST | `/api/services` | Crear |
| GET | `/api/services` | Listar/filtrar/paginar/ordenar |
| GET | `/api/services/:serviceId` | Obtener uno |
| PUT/PATCH | `/api/services/:serviceId` | Actualizar |
| DELETE | `/api/services/:serviceId` | Eliminar |

### Consultas avanzadas

```http
GET /api/services?page=1&limit=5&category=salud&available=true&minPrice=1000&maxPrice=20000&sort=asc&search=consulta
```

Query params:

| Parámetro | Uso |
|---|---|
| `page` | página |
| `limit` | tamaño de página (máx. 100) |
| `category` | categoría exacta sin distinguir mayúsculas |
| `available` | `true` / `false` |
| `minPrice` | precio mínimo |
| `maxPrice` | precio máximo |
| `sort` | `asc` / `desc` por precio |
| `search` | nombre o descripción |

Ejemplo: si MongoDB contiene `"category": "Salud"`, las siguientes consultas coinciden:

```text
?category=salud
?category=Salud
?category=SALUD
```

## Reservas

| Método | Endpoint | Uso |
|---|---|---|
| POST | `/api/bookings` | Crear |
| GET | `/api/bookings` | Listar |
| GET | `/api/bookings/:bookingId` | Consultar con populate |
| GET | `/api/bookings/:bookingId/populated` | Alias de consulta poblada |
| PATCH | `/api/bookings/:bookingId` | Actualizar |
| DELETE | `/api/bookings/:bookingId` | Eliminar |
| POST | `/api/bookings/:bookingId/services/:serviceId` | Agregar o incrementar |
| PUT/PATCH | `/api/bookings/:bookingId/services/:serviceId` | Fijar quantity |
| DELETE | `/api/bookings/:bookingId/services/:serviceId` | Quitar servicio |
| DELETE | `/api/bookings/:bookingId/services` | Vaciar servicios |

## Relación con ObjectId

`Booking` almacena:

```js
services: [
  {
    service: ObjectId,
    quantity: Number
  }
]
```

El schema utiliza:

```js
type: mongoose.Schema.Types.ObjectId,
ref: "Service"
```

La reserva nunca persiste el objeto completo de Service.

## Regla de negocio: servicio repetido

Primera petición:

```http
POST /api/bookings/:bookingId/services/:serviceId
```

```json
{
  "quantity": 2
}
```

Resultado:

```json
{
  "service": "ObjectId",
  "quantity": 2
}
```

Segunda petición para el mismo `serviceId`:

```json
{
  "quantity": 1
}
```

Resultado:

```json
{
  "service": "ObjectId",
  "quantity": 3
}
```

No se duplica la entrada. La suma se calcula en `booking.service.js`, nunca en el DAO.

## Populate

El DAO configura:

```js
{
  path: "services.service",
  select: "name description category price duration available"
}
```

Por eso:

```http
GET /api/bookings/:bookingId
```

devuelve datos completos del servicio relacionado.

## Validación Zod

Las rutas validan `body`, `params` y `query` antes del controller.

Ejemplos:

```text
POST service incompleto → 400
ObjectId inválido → 400
query inválida → 400
```

## Handlebars

Vistas:

```text
/services
/realtime-services
/bookings/:bookingId
```

## Socket.io

La vista:

```text
/realtime-services
```

escucha `services:changed`.

Al crear, actualizar o eliminar un servicio:

```text
API cambia servicio
      ↓
service.controller.js
      ↓
io.emit("services:changed")
      ↓
navegadores conectados
      ↓
tabla se actualiza sin F5
```

## Modelo Message

Se conserva el modelo MongoDB requerido en la evolución del proyecto:

```text
src/models/message.model.js
```

No se agregan endpoints de messages porque la consigna final no los exige.

## Documentación de comprobación

- `docs/ARCHITECTURE.md`
- `docs/TESTING_MANUAL.md`
- `docs/FINAL_CHECKLIST.md`
- `postman/Turnos-Reservas-Final.postman_collection.json`

## Seguridad del repositorio

No versionar:

```text
.env
node_modules/
credenciales reales
```

Comprobar:

```bash
git ls-files .env
git ls-files node_modules
```

Ambos comandos deben devolver vacío.

## Entrega

Antes del último envío:

```bash
npm ci
npm run verify
git status
```

Luego probar MongoDB Atlas, CRUD, populate, Zod, vistas y Socket.io siguiendo `docs/FINAL_CHECKLIST.md`.

No entregar mientras algún punto del checklist esté pendiente.
