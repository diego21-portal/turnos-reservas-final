import { serviceService } from "../services/service.service.js";

function emitServiceChange(req, action, service) {
  const io = req.app.get("io");
  io?.emit("services:changed", {
    action,
    service,
    emittedAt: new Date().toISOString()
  });
}

export async function listServices(req, res) {
  const query = req.validated?.query ?? req.query;
  const result = await serviceService.list(query);
  res.json({ status: "success", ...result });
}

export async function getServiceById(req, res) {
  const { serviceId } = req.validated?.params ?? req.params;
  const service = await serviceService.getById(serviceId);
  res.json({ status: "success", payload: service });
}

export async function createService(req, res) {
  const data = req.validated?.body ?? req.body;
  const service = await serviceService.create(data);
  const payload = service.toObject ? service.toObject() : service;

  emitServiceChange(req, "created", payload);
  res.status(201).json({ status: "success", payload });
}

export async function updateService(req, res) {
  const { serviceId } = req.validated?.params ?? req.params;
  const data = req.validated?.body ?? req.body;
  const service = await serviceService.update(serviceId, data);

  emitServiceChange(req, "updated", service);
  res.json({ status: "success", payload: service });
}

export async function deleteService(req, res) {
  const { serviceId } = req.validated?.params ?? req.params;
  const service = await serviceService.delete(serviceId);

  emitServiceChange(req, "deleted", service);
  res.json({
    status: "success",
    message: "Servicio eliminado correctamente",
    payload: service
  });
}
