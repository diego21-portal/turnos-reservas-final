import { createServer } from "node:http";
import { Server } from "socket.io";
import { app } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/db.config.js";
import { assertRequiredEnv, env } from "./config/env.config.js";
import { configureSockets } from "./sockets/index.js";

async function startServer() {
  try {
    assertRequiredEnv();
    await connectDatabase();

    const httpServer = createServer(app);
    const io = new Server(httpServer);

    app.set("io", io);
    configureSockets(io);

    httpServer.listen(env.PORT, () => {
      console.log(`✅ ${env.APP_NAME}`);
      console.log(`✅ MongoDB conectado`);
      console.log(`✅ Servidor: http://localhost:${env.PORT}`);
      console.log(`✅ Vista servicios: http://localhost:${env.PORT}/services`);
      console.log(
        `✅ Tiempo real: http://localhost:${env.PORT}/realtime-services`
      );
    });

    const shutdown = async (signal) => {
      console.log(`\n${signal} recibido. Cerrando servidor...`);
      io.close();
      httpServer.close(async () => {
        try {
          await disconnectDatabase();
        } finally {
          process.exit(0);
        }
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("❌ No se pudo iniciar la aplicación:", error.message);
    process.exit(1);
  }
}

startServer();
