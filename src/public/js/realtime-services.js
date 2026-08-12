const socket = io();
const statusNode = document.querySelector("#socket-status");
const messageNode = document.querySelector("#realtime-message");
const tableBody = document.querySelector("#services-body");

const money = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2
});

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderServices(services) {
  if (!services.length) {
    tableBody.innerHTML =
      '<tr><td colspan="5" class="empty">No hay servicios cargados.</td></tr>';
    return;
  }

  tableBody.innerHTML = services
    .map(
      (service) => `
        <tr>
          <td>
            <strong>${escapeHtml(service.name)}</strong>
            <small>${escapeHtml(service.description)}</small>
          </td>
          <td>${escapeHtml(service.category)}</td>
          <td>${money.format(Number(service.price ?? 0))}</td>
          <td>${escapeHtml(service.duration)} min</td>
          <td>${service.available ? "Disponible" : "No disponible"}</td>
        </tr>`
    )
    .join("");
}

async function refreshServices() {
  const response = await fetch("/api/services?page=1&limit=100");
  if (!response.ok) throw new Error("No se pudo actualizar la lista");

  const data = await response.json();
  renderServices(data.payload ?? []);
}

socket.on("connect", () => {
  statusNode.textContent = "Conectado";
  statusNode.classList.add("connected");
});

socket.on("disconnect", () => {
  statusNode.textContent = "Desconectado";
  statusNode.classList.remove("connected");
});

socket.on("services:changed", async ({ action }) => {
  try {
    await refreshServices();
    messageNode.hidden = false;
    messageNode.textContent = `Cambio recibido por Socket.io: ${action}.`;
  } catch (error) {
    messageNode.hidden = false;
    messageNode.textContent = error.message;
  }
});
