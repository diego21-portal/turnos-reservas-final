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

## Por qué se separa así

### Routes
Definen endpoints y conectan middlewares/controladores. No contienen consultas MongoDB ni reglas de negocio.

### Controllers
Traducen HTTP a llamadas de aplicación y construyen la respuesta. No ejecutan Mongoose directamente.

### Services
Contienen reglas de negocio: existencia de recursos, servicios duplicados dentro de una reserva, validación referencial y limpieza de referencias al eliminar servicios.

### Repositories
Presentan una interfaz clara de persistencia a la capa de servicios y ocultan detalles del DAO.

### DAO
Única capa que accede directamente a los modelos Mongoose y ejecuta `find`, `findByIdAndUpdate`, `populate`, `$push`, `$pull`, `$set`, etc.

### Models
Representan las colecciones MongoDB.

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

El campo `service` usa:

```js
ref: "Service"
```

Cuando se necesita información completa, el DAO ejecuta `populate("services.service")`.

## Tiempo real

1. El cliente abre `/realtime-services`.
2. Socket.io establece la conexión.
3. Un POST, PUT/PATCH o DELETE modifica un servicio.
4. El controller emite `services:changed`.
5. El navegador recibe el evento.
6. El cliente solicita nuevamente `/api/services` y redibuja la tabla sin recargar la página.
