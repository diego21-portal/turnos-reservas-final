import { bookingService } from "../services/booking.service.js";

export async function listBookings(req, res) {
  const query = req.validated?.query ?? req.query;
  const result = await bookingService.list(query);
  res.json({ status: "success", ...result });
}

export async function getBookingById(req, res) {
  const { bookingId } = req.validated?.params ?? req.params;

  // El endpoint principal devuelve la relación completa mediante populate.
  // Esto hace explícito el requisito de la entrega final.
  const booking = await bookingService.getById(bookingId, {
    populate: true
  });

  res.json({ status: "success", payload: booking });
}

export async function getPopulatedBooking(req, res) {
  const { bookingId } = req.validated?.params ?? req.params;

  // Alias conservado por compatibilidad con el proyecto ya entregado.
  const booking = await bookingService.getById(bookingId, {
    populate: true
  });

  res.json({ status: "success", payload: booking });
}

export async function createBooking(req, res) {
  const data = req.validated?.body ?? req.body;
  const booking = await bookingService.create(data);
  res.status(201).json({ status: "success", payload: booking });
}

export async function updateBooking(req, res) {
  const { bookingId } = req.validated?.params ?? req.params;
  const data = req.validated?.body ?? req.body;
  const booking = await bookingService.update(bookingId, data);
  res.json({ status: "success", payload: booking });
}

export async function deleteBooking(req, res) {
  const { bookingId } = req.validated?.params ?? req.params;
  const booking = await bookingService.delete(bookingId);

  res.json({
    status: "success",
    message: "Reserva eliminada correctamente",
    payload: booking
  });
}

export async function addServiceToBooking(req, res) {
  const { bookingId, serviceId } =
    req.validated?.params ?? req.params;
  const { quantity } = req.validated?.body ?? req.body;

  const booking = await bookingService.addService(
    bookingId,
    serviceId,
    quantity
  );

  res.json({
    status: "success",
    message: "Servicio agregado o cantidad incrementada correctamente",
    payload: booking
  });
}

export async function updateBookingServiceQuantity(req, res) {
  const { bookingId, serviceId } =
    req.validated?.params ?? req.params;
  const { quantity } = req.validated?.body ?? req.body;

  const booking = await bookingService.updateServiceQuantity(
    bookingId,
    serviceId,
    quantity
  );

  res.json({
    status: "success",
    message: "Cantidad actualizada correctamente",
    payload: booking
  });
}

export async function removeServiceFromBooking(req, res) {
  const { bookingId, serviceId } =
    req.validated?.params ?? req.params;

  const booking = await bookingService.removeService(
    bookingId,
    serviceId
  );

  res.json({
    status: "success",
    message: "Servicio eliminado de la reserva",
    payload: booking
  });
}

export async function clearBookingServices(req, res) {
  const { bookingId } = req.validated?.params ?? req.params;
  const booking = await bookingService.clearServices(bookingId);

  res.json({
    status: "success",
    message: "Reserva vaciada correctamente",
    payload: booking
  });
}
