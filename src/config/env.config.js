import "dotenv/config";

const parsedPort = Number.parseInt(process.env.PORT ?? "8080", 10);

export const env = Object.freeze({
  PORT: Number.isNaN(parsedPort) ? 8080 : parsedPort,
  APP_NAME: process.env.APP_NAME?.trim() || "Sistema Backend de Turnos y Reservas",
  APP_ENV: process.env.APP_ENV?.trim() || "development",
  MONGO_URI: process.env.MONGO_URI?.trim() || ""
});

export function assertRequiredEnv() {
  const missing = [];

  if (!env.MONGO_URI) missing.push("MONGO_URI");

  if (missing.length > 0) {
    throw new Error(
      `Faltan variables de entorno obligatorias: ${missing.join(", ")}. Revisá tu archivo .env.`
    );
  }
}
