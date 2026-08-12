export class AppError extends Error {
  constructor(message, statusCode = 500, details = undefined) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function notFoundHandler(req, _res, next) {
  next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404));
}

export function errorHandler(err, _req, res, _next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Error interno del servidor";
  let details = err.details;

  if (err?.name === "CastError") {
    statusCode = 400;
    message = "Identificador o valor con formato inválido";
    details = { path: err.path, value: err.value };
  }

  if (err?.name === "ValidationError") {
    statusCode = 400;
    message = "Error de validación de MongoDB";
    details = Object.values(err.errors ?? {}).map((item) => item.message);
  }

  if (err?.code === 11000) {
    statusCode = 409;
    message = "Ya existe un registro con un valor que debe ser único";
    details = err.keyValue;
  }

  const body = {
    status: "error",
    message
  };

  if (details !== undefined) body.details = details;

  if (process.env.APP_ENV !== "production" && statusCode >= 500) {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
}
