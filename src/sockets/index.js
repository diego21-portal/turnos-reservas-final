export function configureSockets(io) {
  io.on("connection", (socket) => {
    socket.emit("socket:ready", {
      message: "Conexión en tiempo real establecida",
      socketId: socket.id
    });
  });
}
