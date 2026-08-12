import { connectDatabase, disconnectDatabase } from "../src/config/db.config.js";
import { assertRequiredEnv } from "../src/config/env.config.js";
import { ServiceModel } from "../src/models/service.model.js";

const demoServices = [
  {
    name: "Consulta inicial",
    description: "Entrevista inicial para evaluar necesidades y definir el turno.",
    category: "Consultas",
    price: 12000,
    duration: 45,
    available: true
  },
  {
    name: "Seguimiento profesional",
    description: "Sesión de seguimiento para revisar avances y próximos pasos.",
    category: "Seguimiento",
    price: 9000,
    duration: 30,
    available: true
  },
  {
    name: "Asesoría extendida",
    description: "Bloque extendido para casos que requieren mayor tiempo de atención.",
    category: "Asesorías",
    price: 18000,
    duration: 60,
    available: true
  },
  {
    name: "Atención prioritaria",
    description: "Servicio de atención prioritaria sujeto a disponibilidad.",
    category: "Especiales",
    price: 25000,
    duration: 60,
    available: false
  }
];

async function seed() {
  try {
    assertRequiredEnv();
    await connectDatabase();

    for (const service of demoServices) {
      const exists = await ServiceModel.exists({ name: service.name });
      if (!exists) await ServiceModel.create(service);
    }

    const total = await ServiceModel.countDocuments();
    console.log(`✅ Seed completado. Servicios en la base: ${total}`);
  } catch (error) {
    console.error("❌ Error al ejecutar seed:", error.message);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase().catch(() => {});
  }
}

seed();
