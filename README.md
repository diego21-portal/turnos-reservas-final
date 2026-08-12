# Sistema Backend de Turnos y Reservas

Entrega final de Backend: API REST para administrar servicios y reservas, construida con Node.js, Express, MongoDB Atlas y Mongoose. El proyecto aplica arquitectura en capas, validación con Zod, relaciones mediante `ObjectId`, consultas con `populate()`, vistas Handlebars y actualización de servicios en tiempo real con Socket.io.

## Funcionalidades

- CRUD completo de servicios.
- Filtros, paginación y ordenamiento en `GET /api/services`.
- Creación, consulta, actualización y eliminación de reservas.
- Asociación de servicios existentes a una reserva.
- Las reservas guardan únicamente `{ service: ObjectId, quantity }`.
- Consulta de reservas con datos completos de servicios usando `populate()`.
- Validación de body, params y query params con Zod antes de acceder a MongoDB.
- Vista `/services` con Handlebars.
- Vista `/realtime-services` con Socket.io.
- Vista `/bookings/:bookingId` para visualizar una reserva poblada.
- Manejo centralizado de errores.
- Endpoint de salud `/health`.
- Seed opcional de servicios demo.
- Colección de Postman incluida en `postman/`.

## Tecnologías utilizadas

- Node.js 20 o superior.
- Express 5.
- MongoDB Atlas.
- Mongoose 9.
- Zod 4.
- Handlebars mediante `express-handlebars`.
- Socket.io.
- dotenv.

## Arquitectura

```text
routes
  ↓
controllers
  ↓
services
  ↓
repositories
  ↓
DAO
  ↓
models / MongoDB
```

Responsabilidades:

- `routes`: define URLs, métodos HTTP y middlewares.
- `controllers`: recibe request y construye response.
- `services`: contiene reglas de negocio.
- `repositories`: abstrae las operaciones de persistencia requeridas por los services.
- `dao`: ejecuta consultas Mongoose.
- `models`: define esquemas y relaciones MongoDB.
- `schemas`: validaciones Zod.
- `views`: vistas Handlebars.
- `sockets`: configuración de Socket.io.

## Estructura del proyecto

```text
.
├── docs/
│   ├── ARCHITECTURE.md
│   ├── FINAL_CHECKLIST.md
│   └── TESTING_MANUAL.md
├── postman/
│   └── Turnos-Reservas-Final.postman_collection.json
├── scripts/
│   ├── check-syntax.js
│   └── seed.js
├── src/
│   ├── config/
│   ├── controllers/
│   ├── dao/
│   ├── middlewares/
│   ├── models/
│   ├── public/
│   ├── repositories/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   ├── sockets/
│   ├── views/
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Instalación

Clonar el repositorio:

```bash
git clone URL_DE_TU_REPOSITORIO
cd NOMBRE_DEL_REPOSITORIO
```

Instalar dependencias:

```bash
npm install
```

Después de `npm install`, conservar y subir también el `package-lock.json` generado.

## Variables de entorno

Copiar `.env.example` como `.env`.

En PowerShell:

```powershell
Copy-Item .env.example .env
```

En CMD:

```cmd
copy .env.example .env
```

Configurar:

```env
PORT=8080
APP_NAME=Sistema Backend de Turnos y Reservas
APP_ENV=development
MONGO_URI=mongodb+srv://USUARIO:PASSWORD@CLUSTER.mongodb.net/turnos_reservas?retryWrites=true&w=majority
```

> Nunca subir `.env` al repositorio. Si el usuario o contraseña de Atlas contiene caracteres especiales, la credencial debe estar correctamente codificada en la URI.

## Ejecución

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

Cargar servicios demo opcionales:

```bash
npm run seed
```

Verificar sintaxis del proyecto:

```bash
npm run check
```

Aplicación por defecto:

```text
http://localhost:8080
```

## Endpoints principales

### Estado

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/health` | Comprueba que la aplicación responde |

### Servicios

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/services` | Crear servicio |
| GET | `/api/services` | Listar servicios con consultas avanzadas |
| GET | `/api/services/:serviceId` | Consultar servicio por id |
| PUT/PATCH | `/api/services/:serviceId` | Actualizar servicio |
| DELETE | `/api/services/:serviceId` | Eliminar servicio |

### Query params de `GET /api/services`

| Parámetro | Ejemplo | Uso |
|---|---|---|
| `page` | `1` | Página actual |
| `limit` | `10` | Resultados por página, máximo 100 |
| `category` | `Consultas` | Filtrar por categoría |
| `available` | `true` | Filtrar disponibilidad |
| `minPrice` | `5000` | Precio mínimo |
| `maxPrice` | `20000` | Precio máximo |
| `sort` | `asc` o `desc` | Ordenar por precio |
| `search` | `consulta` | Buscar en nombre o descripción |

Ejemplo:

```http
GET /api/services?page=1&limit=5&category=Consultas&available=true&minPrice=5000&maxPrice=20000&sort=asc
```

Respuesta paginada:

```json
{
  "status": "success",
  "payload": [],
  "totalDocs": 0,
  "totalPages": 1,
  "page": 1,
  "limit": 5,
  "hasPrevPage": false,
  "hasNextPage": false,
  "prevPage": null,
  "nextPage": null
}
```

### Reservas

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/bookings` | Crear reserva |
| GET | `/api/bookings` | Listar reservas |
| GET | `/api/bookings/:bookingId` | Consultar reserva sin populate |
| GET | `/api/bookings/:bookingId/populated` | Consultar reserva con populate |
| PATCH | `/api/bookings/:bookingId` | Actualizar datos de la reserva |
| DELETE | `/api/bookings/:bookingId` | Eliminar reserva |
| POST | `/api/bookings/:bookingId/services/:serviceId` | Agregar servicio |
| PUT/PATCH | `/api/bookings/:bookingId/services/:serviceId` | Actualizar cantidad |
| DELETE | `/api/bookings/:bookingId/services/:serviceId` | Quitar un servicio |
| DELETE | `/api/bookings/:bookingId/services` | Vaciar servicios de la reserva |

También puede usarse:

```http
GET /api/bookings?page=1&limit=10&status=pending&populate=true
```

## Ejemplos de body

### Crear servicio

```json
{
  "name": "Consulta inicial",
  "description": "Evaluación inicial para definir el servicio requerido.",
  "category": "Consultas",
  "price": 12000,
  "duration": 45,
  "available": true
}
```

### Crear reserva con servicios

```json
{
  "customerName": "Cliente Ejemplo",
  "customerEmail": "diego@example.com",
  "scheduledAt": "2026-08-20T15:30:00.000Z",
  "notes": "Primera visita",
  "services": [
    {
      "serviceId": "REEMPLAZAR_POR_OBJECT_ID_REAL",
      "quantity": 1
    }
  ]
}
```

En MongoDB la relación se guarda de esta forma:

```json
{
  "services": [
    {
      "service": "ObjectId(...) ",
      "quantity": 1
    }
  ]
}
```

No se almacena el objeto completo del servicio dentro de la reserva.

### Agregar servicio a una reserva

```json
{
  "quantity": 2
}
```

### Actualizar cantidad

```json
{
  "quantity": 3
}
```

## Vistas Handlebars

```text
GET /services
GET /realtime-services
GET /bookings/:bookingId
```

La vista `/realtime-services` recibe eventos de Socket.io cuando un servicio es creado, actualizado o eliminado desde la API. La tabla vuelve a consultar los datos automáticamente, sin recargar manualmente la página.

## Pruebas manuales

Importar en Postman:

```text
postman/Turnos-Reservas-Final.postman_collection.json
```

La guía completa está en:

```text
docs/TESTING_MANUAL.md
```

Como mínimo verificar:

1. crear servicio;
2. listar servicios;
3. consultar servicio por id;
4. actualizar servicio;
5. eliminar servicio;
6. crear reserva;
7. consultar reserva;
8. agregar servicio a reserva;
9. eliminar servicio de reserva;
10. actualizar cantidad;
11. vaciar o eliminar reserva;
12. consultar reserva con `populate()`;
13. casos de error;
14. vistas;
15. Socket.io.

## Manejo de errores

La API devuelve errores JSON consistentes. Ejemplo:

```json
{
  "status": "error",
  "message": "Datos inválidos en body",
  "details": [
    {
      "path": "name",
      "message": "Too small: expected string to have >=3 characters"
    }
  ]
}
```

Códigos usados principalmente:

- `400`: datos inválidos.
- `404`: recurso inexistente.
- `409`: conflicto, por ejemplo servicio duplicado dentro de una reserva.
- `500`: error interno inesperado.

## Integridad entre servicios y reservas

Cuando un servicio es eliminado, su referencia también se quita de las reservas que lo contenían. Esto evita dejar referencias inválidas que luego produzcan un `populate()` incompleto.

## Checklist previa a la entrega

Consultar:

```text
docs/FINAL_CHECKLIST.md
```

Antes de pegar el enlace en la plataforma ejecutar:

```bash
npm run check
git status
git log --oneline -5
```

Y verificar en GitHub que NO existan:

```text
.env
node_modules/
credenciales de MongoDB Atlas
```

## Notas adicionales

- La persistencia principal es MongoDB Atlas mediante Mongoose.
- La validación ocurre antes de los services/repositories/DAO.
- El acceso a datos está aislado en DAO.
- Los datos relacionados se resuelven con `populate()` sólo cuando la consulta lo requiere.
- El proyecto está pensado para evaluación local y para futuras mejoras como autenticación, disponibilidad por franjas horarias, tests automatizados o documentación OpenAPI.
